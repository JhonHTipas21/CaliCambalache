import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mensajes')
@UseGuards(JwtAuthGuard)
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  // MÉTODO POST: CREACIÓN
  @Post()
  create(@Body() createMensajeDto: CreateMensajeDto) {
    return this.mensajesService.create(createMensajeDto);
  }

  // MÉTODO GET: LECTURA GENERAL (Todos los mensajes)
  @Get()
  findAll(@Query() query: any) {
    return this.mensajesService.findAll(query);
  }

  // MÉTODO GET: LECTURA INDIVIDUAL (Por ID)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mensajesService.findOne(id);
  }

  // MÉTODO PATCH: ACTUALIZAR UNA PARTE
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMensajeDto: UpdateMensajeDto) {
    return this.mensajesService.update(id, updateMensajeDto);
  }

  // MÉTODO PUT: ACTUALIZACIÓN COMPLETA
  @Put(':id')
  updateCompleto(@Param('id') id: string, @Body() updateMensajeDto: UpdateMensajeDto) {
    // Para simplificar, en mongoose lo manejamos con update también
    return this.mensajesService.update(id, updateMensajeDto);
  }

  // MÉTODO DELETE: ELIMINAR
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensajesService.remove(id);
  }
}
