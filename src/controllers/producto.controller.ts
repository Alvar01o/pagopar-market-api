import { Request, Response } from 'express';
import ProductoModel from '../models/producto.model';
import loggerMiddleware from '../middlewares/logger';

export class ProductoController {
  public async create(req: Request, res: Response) {
    const items = new ProductoModel(req.body);
    try {
      await items.save();
      res.status(201).send(items);
    } catch (e) {
      console.error('Error creating producto:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const items = await ProductoModel.find({});
      res.send(items);
    } catch (e) {
      console.error('Error fetching all productos:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getById(req: Request, res: Response) {
    const ID = req.params.id;
    try {
      const item = await ProductoModel.findById(ID);
      if (!item) {
        console.error('Producto not found:', ID);
        res.status(404).send();
      } else {
        res.status(201).send(item);
      }
    } catch (error) {
      console.error('Error fetching producto by ID:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comprador', 'monto_total', 'tipo_pedido', 'compras_items', 'fecha_maxima_pago', 'id_pedido_comercio'];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      console.error('Invalid operation:', updates);
      res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const item = await ProductoModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) {
        console.error('Producto not found:', req.params.id);
        res.status(404).send();
      } else {
        res.send(item);
      }
    } catch (e) {
      console.error('Error patching producto by ID:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // Add logging middleware
  public useLoggerMiddleware = loggerMiddleware;
}
