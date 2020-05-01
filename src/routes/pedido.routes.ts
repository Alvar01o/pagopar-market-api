import express from 'express';
import { PedidoController } from '../controllers/pedido.controller';

export class PedidoRoutes {
  public controller: PedidoController = new PedidoController();

  public routes(app: express.Application): void {
    app
      .route('/pedidos')
      .get(this.controller.getAll)
      .post(this.controller.create);

    app
      .route('/pedidos/:id')
      .get(this.controller.getById)
      .patch(this.controller.patchById);
  }
}
