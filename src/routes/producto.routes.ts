import express from 'express';
import { ProductoController } from '../controllers/producto.controller';

export class ProductoRoutes {
  public controller: ProductoController = new ProductoController();

  public routes(app: express.Application): void {
    app
      .route('/producto')
      .get(this.controller.getAll)
      .post(this.controller.create);

    app
      .route('/producto/:id')
      .get(this.controller.getById)
      .patch(this.controller.patchById);
  }
}
