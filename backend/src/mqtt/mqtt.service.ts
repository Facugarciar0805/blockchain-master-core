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
    private prev_hash: string | null = null;

    constructor(transactionsRepository: TransactionsRepositoryService,
                walletRepository: WalletRepositoryService) {
        this.transactionsRepository = transactionsRepository;
        this.walletRepository = walletRepository;
    }

    onModuleInit() {
        this.connectToBroker();
    }

    private connectToBroker() {
        const brokerUrl = 'mqtt://172.22.43.231:1883';

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

    // Métod0 público que usará tu controlador para mandar el problema
    public async publishProblem(transactionData: CreateTransactionDto) {

        if (!this.prev_hash) {
            const last = await this.transactionsRepository.findLast();
            this.prev_hash = last && last.hash ? last.hash : '0x000_GENESIS_HASH';
        }

        const topic = 'mining/work';
        const blockData = JSON.stringify({
            ...transactionData,
            prev_hash: this.prev_hash,
            status: 'pending'
        });

        const payload = JSON.stringify({
            data: blockData,
            id: 1,
            diff: 3,
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

            await this.transactionsRepository.createBlock(blockDto);

            const senderWallet = await this.walletRepository.findByAddress(blockDto.sender_wallet_id);
            const receiverWallet = await this.walletRepository.findByAddress(blockDto.receiver_wallet_id);

            if (senderWallet && receiverWallet) {
                if (senderWallet.balance < blockDto.amount) {
                    this.logger.warn(`Saldo insuficiente en ${senderWallet.address}: ${senderWallet.balance} < ${blockDto.amount}`);
                    return;
                }

                senderWallet.balance -= blockDto.amount;
                await this.walletRepository.update(senderWallet.address, senderWallet);

                receiverWallet.balance += blockDto.amount;
                await this.walletRepository.update(receiverWallet.address, receiverWallet);

                this.logger.log(`Balances actualizados: -${blockDto.amount} al sender, +${blockDto.amount} al receiver`);
            } else {
                this.logger.warn('No se pudieron actualizar los balances: wallet(s) no encontrada(s)');
            }

            this.prev_hash = hash;

            this.logger.log(`Bloque minado guardado: workId=${workId} hash=${hash} minero=${miner} nonce=${nonce}`);
        } catch (error) {
            this.logger.error('Error procesando solución minada:', error);
        }
    }
}