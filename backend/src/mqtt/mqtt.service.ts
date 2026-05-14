import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import {CreateTransactionDto} from "../transactions/dto/create-transaction.dto";
import {TransactionsRepositoryService} from "../repository/transaction/transactions.repository.service";


@Injectable()
export class MqttService implements OnModuleInit {
    private mqttClient: mqtt.MqttClient;
    private readonly logger = new Logger(MqttService.name);
    private transactionsRepository: TransactionsRepositoryService
    private prev_hash: string | null = null;

    constructor(transactionsRepository: TransactionsRepositoryService) {
        this.transactionsRepository = transactionsRepository;
    }

    onModuleInit() {
        this.connectToBroker();
    }

    private connectToBroker() {
        const brokerUrl = 'mqtt://localhost:1883';

        this.logger.log(`Conectando al broker MQTT en ${brokerUrl}...`);
        this.mqttClient = mqtt.connect(brokerUrl);

        // Evento: Conexión exitosa
        this.mqttClient.on('connect', () => {
            this.logger.log('Conectado exitosamente a Mosquitto');

            // Nos suscribimos al topic donde los ESP32 mandan la solución
            this.mqttClient.subscribe('/mining/solution', (err) => {
                if (!err) {
                    this.logger.log('Suscrito correctamente a /mining/solution');
                } else {
                    this.logger.error('Error al suscribirse:', err);
                }
            });
        });

        // Evento: Recepción de mensajes (Aquí entra lo que manda el ESP32)
        this.mqttClient.on('message', (topic, message) => {
            if (topic === '/mining/solution') {
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

        const topic = '/mining/problem';
        const payload = JSON.stringify({
            ...transactionData,
            prev_hash: this.prev_hash,
            status: 'pending'
        });

        this.mqttClient.publish(topic, payload, (err) => {
            if (err) {
                this.logger.error(`Error publicando en ${topic}:`, err);
            } else {
                this.logger.log(`Problema de minado enviado a ${topic}`);
            }
        });
    }


    // Lógica de negocio cuando llega una solución
    private handleMiningSolution(payload: string) {
        try {
            const data = JSON.parse(payload);
            // Acá hacés "toda la bola":
            // 1. Validar el hash
            // 2. Actualizar el estado de la transacción en tu DB a "minada/completada"
            // 3. Actualizar balances de las wallets
        } catch (error) {
            this.logger.error('El ESP32 no mandó un JSON válido:', payload);
        }
    }
}