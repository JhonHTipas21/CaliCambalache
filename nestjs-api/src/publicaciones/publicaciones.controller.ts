import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  crear(@Body() datos: any, @Request() req) {
    return this.publicacionesService.crear(datos, req.user.userId);
  }

  @Get()
  buscarActivas(@Query('categoria') categoria?: string, @Query('busqueda') busqueda?: string) {
    return this.publicacionesService.buscarActivas(categoria, busqueda);
  }

  @Get('mis-donaciones')
  buscarPorDonante(@Request() req) {
    return this.publicacionesService.buscarPorDonante(req.user.userId);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.publicacionesService.buscarPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: any, @Request() req) {
    return this.publicacionesService.actualizar(id, datos, req.user.userId);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Request() req) {
    return this.publicacionesService.eliminar(id, req.user.userId);
  }
}
