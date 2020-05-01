import express from 'express';
import { PagoparController } from '../controllers/pagopar.controller';

export class PagoparRoutes {
  public controller: PagoparController = new PagoparController();

  public routes(app: express.Application): void {
    app.route('/').get(this.controller.hello);
    app.route('/pagopar').post(this.controller.create);
    app.route('/pagopar/respuesta').post(this.controller.respuesta);
    app.route('/pagopar/resultado/:hash').get(this.controller.resultado);
    app.route('/pagopar/categorias').get(this.controller.getCategorias);
    app.route('/pagopar/ciudades').get(this.controller.getCiudades);
  }
}
