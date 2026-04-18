import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MensajesModule } from './mensajes/mensajes.module';

@Module({
  imports: [
    // Conexión a MongoDB
    // Reemplaza <usuario>, <password>, y <cluster-url> con tu cadena real de MongoDB Atlas o usa la local
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/calicambalache_db'),
    MensajesModule,
  ],
})
export class AppModule {}
