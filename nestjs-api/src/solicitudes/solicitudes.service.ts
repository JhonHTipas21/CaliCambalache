import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Solicitud, SolicitudDocument } from './schemas/solicitud.schema';
import { PublicacionesService } from '../publicaciones/publicaciones.service';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitud.name) private readonly solicitudModel: Model<SolicitudDocument>,
    private readonly publicacionesService: PublicacionesService,
  ) {}

  async crear(datos: { publicacionId: string; mensaje: string }, receptoraId: string): Promise<SolicitudDocument> {
    const publicacion = await this.publicacionesService.buscarPorId(datos.publicacionId);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publicacion.estado !== 'activo') {
      throw new BadRequestException('Esta publicación no está disponible para solicitar');
    }

    // Verificar si ya existe una solicitud pendiente de esta receptora para esta publicacion
    const existente = await this.solicitudModel.findOne({
      publicacion: datos.publicacionId,
      receptora: receptoraId,
      estado: 'pendiente',
    });

    if (existente) {
      throw new BadRequestException('Ya has enviado una solicitud para este alimento que está pendiente');
    }

    const nueva = new this.solicitudModel({
      publicacion: datos.publicacionId,
      receptora: receptoraId,
      donante: publicacion.donante,
      mensaje: datos.mensaje,
      estado: 'pendiente',
    });

    return (await nueva.save()).populate([
      { path: 'publicacion' },
      { path: 'donante', select: 'nombre email telefono' },
      { path: 'receptora', select: 'nombre email telefono' }
    ]);
  }

  async buscarMisSolicitudes(receptoraId: string): Promise<SolicitudDocument[]> {
    return this.solicitudModel
      .find({ receptora: receptoraId })
      .populate('publicacion')
      .populate('donante', 'nombre email telefono')
      .sort({ createdAt: -1 })
      .exec();
  }

  async buscarSolicitudesRecibidas(donanteId: string): Promise<SolicitudDocument[]> {
    return this.solicitudModel
      .find({ donante: donanteId })
      .populate('publicacion')
      .populate('receptora', 'nombre email telefono')
      .sort({ createdAt: -1 })
      .exec();
  }

  async actualizarEstado(id: string, estado: string, usuarioId: string): Promise<SolicitudDocument> {
    const solicitud = await this.solicitudModel.findById(id);
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const esDonante = solicitud.donante.toString() === usuarioId;
    const esReceptora = solicitud.receptora.toString() === usuarioId;

    if (!esDonante && !esReceptora) {
      throw new BadRequestException('No tienes permiso para modificar esta solicitud');
    }

    if (esDonante) {
      if (!['aprobada', 'rechazada', 'entregada'].includes(estado)) {
        throw new BadRequestException('Estado inválido para el donante');
      }
      solicitud.estado = estado;

      if (estado === 'aprobada') {
        await this.publicacionesService.actualizarEstado(solicitud.publicacion.toString(), 'solicitado');
      } else if (estado === 'entregada') {
        await this.publicacionesService.actualizarEstado(solicitud.publicacion.toString(), 'entregado');
      } else if (estado === 'rechazada') {
        await this.publicacionesService.actualizarEstado(solicitud.publicacion.toString(), 'activo');
      }
    } else {
      if (estado !== 'rechazada') {
        throw new BadRequestException('La receptora solo puede cancelar (rechazar) la solicitud');
      }
      solicitud.estado = 'rechazada';
      await this.publicacionesService.actualizarEstado(solicitud.publicacion.toString(), 'activo');
    }

    await solicitud.save();
    return solicitud.populate([
      { path: 'publicacion' },
      { path: 'donante', select: 'nombre email telefono' },
      { path: 'receptora', select: 'nombre email telefono' }
    ]);
  }

  async eliminar(id: string, receptoraId: string): Promise<void> {
    const solicitud = await this.solicitudModel.findOne({ _id: id, receptora: receptoraId });
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden eliminar solicitudes pendientes');
    }

    await this.solicitudModel.deleteOne({ _id: id });
  }

  async buscarPorId(id: string, usuarioId: string): Promise<SolicitudDocument> {
    const solicitud = await this.solicitudModel.findById(id)
      .populate('publicacion')
      .populate('donante', 'nombre email telefono')
      .populate('receptora', 'nombre email telefono')
      .exec();
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const esDonante = solicitud.donante && (solicitud.donante.toString() === usuarioId || (solicitud.donante as any)._id?.toString() === usuarioId);
    const esReceptora = solicitud.receptora && (solicitud.receptora.toString() === usuarioId || (solicitud.receptora as any)._id?.toString() === usuarioId);

    if (!esDonante && !esReceptora) {
      throw new BadRequestException('No tienes permiso para ver esta solicitud');
    }

    return solicitud;
  }
}
