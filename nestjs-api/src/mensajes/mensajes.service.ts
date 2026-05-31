import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { Mensaje, MensajeDocument } from './schemas/mensaje.schema';

@Injectable()
export class MensajesService {
  constructor(
    @InjectModel(Mensaje.name) private mensajeModel: Model<MensajeDocument>
  ) {}

  // Crear un nuevo mensaje en MongoDB
  async create(createMensajeDto: CreateMensajeDto): Promise<Mensaje> {
    const createdMensaje = new this.mensajeModel(createMensajeDto);
    return createdMensaje.save();
  }

  // Traer todos los mensajes (con filtro y población de referencias)
  async findAll(query: any = {}): Promise<Mensaje[]> {
    return this.mensajeModel
      .find(query)
      .populate('emisor', 'nombre email rol')
      .populate('receptor', 'nombre email rol')
      .exec();
  }

  // Traer un solo mensaje por ID
  async findOne(id: string): Promise<Mensaje> {
    const mensaje = await this.mensajeModel.findById(id).exec();
    if (!mensaje) {
      throw new NotFoundException(`El mensaje con ID #${id} no se encuentra`);
    }
    return mensaje;
  }

  // Actualizar un mensaje por ID (funciona para PUT y PATCH en la lógica de Mongoose)
  async update(id: string, updateMensajeDto: UpdateMensajeDto): Promise<Mensaje> {
    const updatedMensaje = await this.mensajeModel
      .findByIdAndUpdate(id, updateMensajeDto, { new: true })
      .exec();
    if (!updatedMensaje) {
      throw new NotFoundException(`El mensaje con ID #${id} no se encuentra para actualizar`);
    }
    return updatedMensaje;
  }

  // Eliminar un mensaje por ID
  async remove(id: string): Promise<Mensaje> {
    const deletedMensaje = await this.mensajeModel.findByIdAndDelete(id).exec();
    if (!deletedMensaje) {
      throw new NotFoundException(`El mensaje con ID #${id} no se encuentra para eliminar`);
    }
    return deletedMensaje;
  }
}
