import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('solicitudes')
@UseGuards(JwtAuthGuard)
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  crear(@Body() datos: { publicacionId: string; mensaje: string }, @Request() req) {
    return this.solicitudesService.crear(datos, req.user.userId);
  }

  @Get('mis-solicitudes')
  buscarMisSolicitudes(@Request() req) {
    return this.solicitudesService.buscarMisSolicitudes(req.user.userId);
  }

  @Get('recibidas')
  buscarSolicitudesRecibidas(@Request() req) {
    return this.solicitudesService.buscarSolicitudesRecibidas(req.user.userId);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string, @Request() req) {
    return this.solicitudesService.buscarPorId(id, req.user.userId);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body('estado') estado: string, @Request() req) {
    return this.solicitudesService.actualizarEstado(id, estado, req.user.userId);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Request() req) {
    return this.solicitudesService.eliminar(id, req.user.userId);
  }
}
