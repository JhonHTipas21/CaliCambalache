import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  async crear(datos: Partial<Publicacion>, donanteId: string): Promise<PublicacionDocument> {
    const nueva = new this.publicacionModel({
      ...datos,
      donante: donanteId,
      estado: 'activo',
    });
    return nueva.save();
  }

  async buscarActivas(categoria?: string, busqueda?: string): Promise<PublicacionDocument[]> {
    const filtro: any = { estado: 'activo' };
    
    if (categoria) {
      filtro.categoria = categoria;
    }
    
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
        { ubicacion: { $regex: busqueda, $options: 'i' } },
      ];
    }
    
    return this.publicacionModel
      .find(filtro)
      .populate('donante', 'nombre email telefono')
      .sort({ createdAt: -1 })
      .exec();
  }

  async buscarPorDonante(donanteId: string): Promise<PublicacionDocument[]> {
    return this.publicacionModel
      .find({ donante: donanteId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async buscarPorId(id: string): Promise<PublicacionDocument | null> {
    return this.publicacionModel
      .findById(id)
      .populate('donante', 'nombre email telefono')
      .exec();
  }

  async actualizar(id: string, datos: Partial<Publicacion>, donanteId: string): Promise<PublicacionDocument> {
    const publicacion = await this.publicacionModel.findOne({ _id: id, donante: donanteId });
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada o no pertenece al donante');
    }
    
    Object.assign(publicacion, datos);
    return publicacion.save();
  }

  async actualizarEstado(id: string, estado: string): Promise<PublicacionDocument> {
    const publicacion = await this.publicacionModel.findByIdAndUpdate(id, { estado }, { new: true });
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }
    return publicacion;
  }

  async eliminar(id: string, donanteId: string): Promise<void> {
    const result = await this.publicacionModel.deleteOne({ _id: id, donante: donanteId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Publicación no encontrada o no pertenece al donante');
    }
  }
}
