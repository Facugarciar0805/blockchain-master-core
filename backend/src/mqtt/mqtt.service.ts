import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import {CreateTransactionDto} from "../transactions/dto/create-transaction.dto";
import {CreateBlockDto} from "../repository/transaction/dto/create-block.dto";
import {TransactionsRepositoryService} from "../repository/transaction/transactions.repository.service";
import {WalletRepositoryService} from "../repository/wallet/wallet.repository.service";


@Injectable()
export class MqttService implements OnModuleInit {
    private mqttClient: mqtt.MqttClient;
    private readonly logger = new Logger(MqttService.name);
    private transactionsRepository: TransactionsRepositoryService
    private walletRepository: WalletRepositoryService
    private prev_hash: string = '0x000_GENESIS_HASH';
    private nextProblemId: number = 1;
    private isProcessing = false;
    private pendingQueue: CreateTransactionDto[] = [];

    constructor(transactionsRepository: TransactionsRepositoryService,
                walletRepository: WalletRepositoryService) {
        this.transactionsRepository = transactionsRepository;
        this.walletRepository = walletRepository;
    }

    async onModuleInit() {
        await this.initPrevHash();
        this.connectToBroker();
    }

    private async initPrevHash() {
        try {
            const last = await this.transactionsRepository.findLast();
            if (last && last.hash) {
                this.prev_hash = last.hash;
                this.logger.log(`prev_hash inicializado desde DB: ${this.prev_hash}`);
            }
        } catch {
            this.logger.warn('No se pudo obtener el último hash de la DB, usando genesis');
        }
    }

    private connectToBroker() {
        const brokerUrl = 'mqtt://52.205.116.199:1883';

        this.logger.log(`Conectando al broker MQTT en ${brokerUrl}...`);
        this.mqttClient = mqtt.connect(brokerUrl);

        // Evento: Conexión exitosa
        this.mqttClient.on('connect', () => {
            this.logger.log('Conectado exitosamente a Mosquitto');

            // Nos suscribimos al topic donde los ESP32 mandan la solución
            this.mqttClient.subscribe('mining/resolved', (err) => {
                if (!err) {
                    this.logger.log('Suscrito correctamente a mining/resolved');
                } else {
                    this.logger.error('Error al suscribirse:', err);
                }
            });
        });

        // Evento: Recepción de mensajes (Aquí entra lo que manda el ESP32)
        this.mqttClient.on('message', (topic, message) => {
            if (topic === 'mining/resolved') {
                const payload = message.toString();
                this.logger.log(`¡Solución recibida del ESP32! Payload: ${payload}`);
                this.handleMiningSolution(payload);
            }
        });

        // Manejo de errores de conexión
        this.mqttClient.on('error', (err) => {
            this.logger.error(`Error en MQTT: ${err.message}`);
        });
    }

    getPendingQueue() {
        return {
            count: this.pendingQueue.length,
            transactions: [...this.pendingQueue],
            isProcessing: this.isProcessing,
            currentPrevHash: this.prev_hash,
        };
    }

    public async publishProblem(transactionData: CreateTransactionDto) {
        if (this.isProcessing) {
            this.pendingQueue.push(transactionData);
            this.logger.log(`Transacción encolada (cola: ${this.pendingQueue.length})`);
            return;
        }

        this.isProcessing = true;
        this.sendWork(transactionData);
    }

    private sendWork(transactionData: CreateTransactionDto) {
        const topic = 'mining/work';
        const blockData = JSON.stringify({
            ...transactionData,
            prev_hash: this.prev_hash,
            status: 'pending'
        });

        const problemId = this.nextProblemId++;
        const payload = JSON.stringify({
            data: blockData,
            id: problemId,
            diff: 4,
            required: 1
        })

        this.mqttClient.publish(topic, payload, (err) => {
            if (err) {
                this.logger.error(`Error publicando en ${topic}:`, err);
            } else {
                this.logger.log(`Problema de minado enviado a ${topic}`);
            }
        });
    }


    private async handleMiningSolution(payload: string) {
        try {
            const data = JSON.parse(payload);

            const { miner, workId, nonce, hash, block, diff, elapsedMs } = data;

            const blockData = JSON.parse(block);

            const blockDto = new CreateBlockDto();
            blockDto.prev_hash = blockData.prev_hash;
            blockDto.hash = hash;
            blockDto.amount = blockData.amount;
            blockDto.sender_wallet_id = blockData.sender_wallet_id;
            blockDto.receiver_wallet_id = blockData.receiver_wallet_id;
            blockDto.descrip = blockData.descrip ? blockData.descrip : "No description";
            blockDto.nonce = nonce;
            blockDto.status = 'confirmed';

            const senderWallet = await this.walletRepository.findByAddress(blockDto.sender_wallet_id);
            const receiverWallet = await this.walletRepository.findByAddress(blockDto.receiver_wallet_id);

            if (senderWallet && receiverWallet) {
                if (blockDto.amount <= 0) {
                    this.logger.warn(`Monto inválido: ${blockDto.amount}`);
                    this.processQueue();
                    return;
                }

                if (blockDto.sender_wallet_id === blockDto.receiver_wallet_id) {
                    this.logger.warn(`El sender y receiver son la misma wallet: ${blockDto.sender_wallet_id}`);
                    this.processQueue();
                    return;
                }

                if (senderWallet.balance < blockDto.amount) {
                    this.logger.warn(`Saldo insuficiente en ${senderWallet.address}: ${senderWallet.balance} < ${blockDto.amount}`);
                    this.processQueue();
                    return;
                }

                senderWallet.balance -= blockDto.amount;
                await this.walletRepository.update(senderWallet.address, senderWallet);

                receiverWallet.balance += blockDto.amount;
                await this.walletRepository.update(receiverWallet.address, receiverWallet);

                await this.transactionsRepository.createBlock(blockDto);

                this.logger.log(`Balances actualizados: -${blockDto.amount} al sender, +${blockDto.amount} al receiver`);
            } else {
                this.logger.warn('No se pudieron actualizar los balances: wallet(s) no encontrada(s)');
            }

            this.prev_hash = hash;

            this.logger.log(`Bloque minado guardado: workId=${workId} hash=${hash} minero=${miner} nonce=${nonce}`);

            this.processQueue();
        } catch (error) {
            this.logger.error('Error procesando solución minada:', error);
            this.isProcessing = false;
        }
    }

    private processQueue() {
        if (this.pendingQueue.length > 0) {
            const next = this.pendingQueue.shift()!;
            this.logger.log(`Enviando siguiente de la cola (quedan ${this.pendingQueue.length})`);
            this.sendWork(next);
        } else {
            this.isProcessing = false;
        }
    }
}