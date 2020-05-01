import express from 'express';
import { ItemController } from '../controllers/item.controller';

export class ItemRoutes {
  public controller: ItemController = new ItemController();

  public routes(app: express.Application): void {
    app
      .route('/items')
      .get(this.controller.getAll)
      .post(this.controller.create);

    app
      .route('/items/:id')
      .get(this.controller.getById)
      .patch(this.controller.patchById);
  }
}
