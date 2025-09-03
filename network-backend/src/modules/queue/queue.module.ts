import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'RECOMMENDATION_QUEUE',
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `amqp://${config.get('RABBITMQ_USER')}:${config.get('RABBITMQ_PASS')}@${config.get('RABBITMQ_HOST')}:${config.get('RABBITMQ_PORT')}`
                        ],
                        queue: 'recommendation_queue',
                        queueOptions: { 
                            durable: true ,
                        },
                    },
                }),
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class QueueModule { }
