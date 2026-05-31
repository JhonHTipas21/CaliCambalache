import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Solicitud, SolicitudSchema } from './schemas/solicitud.schema';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Solicitud.name, schema: SolicitudSchema }]),
    PublicacionesModule,
  ],
  providers: [SolicitudesService],
  controllers: [SolicitudesController],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}
