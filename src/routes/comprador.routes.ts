import express from 'express';
import { CompradorController } from '../controllers/comprador.controller';

export class CompradorRoutes {
  public controller: CompradorController = new CompradorController();

  public routes(app: express.Application): void {
    app
      .route('/compradores')
      .get(this.controller.getAll)
      .post(this.controller.create);

    app
      .route('/compradores/:id')
      .get(this.controller.getById)
      .patch(this.controller.patchById);
  }
}
