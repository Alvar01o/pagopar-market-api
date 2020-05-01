import { Request, Response } from 'express';
import ProductoModel from '../models/producto.model';

export class ProductoController {
  public async create(req: Request, res: Response) {
    const items = new ProductoModel(req.body);
    console.log(req.body);
    try {
      await items.save();
      res.status(201).send(items);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const items = await ProductoModel.find({});
      res.send(items);
    } catch (e) {
      res.status(404).send();
    }
  }

  public async getById(req: Request, res: Response) {
    const ID = req.params.id;
    try {
      const item = await ProductoModel.findById(ID);
      if (!item) {
        res.status(404).send();
      } else {
        res.status(201).send(item);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comprador', 'monto_total', 'tipo_pedido', 'compras_items', 'fecha_maxima_pago', 'id_pedido_comercio'];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const item = await ProductoModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) {
        res.status(404).send();
      } else {
        res.send(item);
      }
    } catch (e) {
      res.status(404).send(e);
    }
  }
}
