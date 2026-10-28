import { Request, Response } from 'express';
import PedidoModel from '../models/pedido.model';
import loggerMiddleware from '../middlewares/logger';

export class PedidoController {
  public async create(req: Request, res: Response) {
    const pedidos = new PedidoModel(req.body);
    try {
      await pedidos.save();
      res.status(201).send(pedidos);
    } catch (e) {
      console.error('Error creating pedido:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const pedidos = await PedidoModel.find({});
      res.send(pedidos);
    } catch (e) {
      console.error('Error fetching all pedidos:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getById(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const pedido = await PedidoModel.findById(_id);
      if (!pedido) {
        console.error('Pedido not found:', _id);
        res.status(404).send();
      } else {
        res.status(201).send(pedido);
      }
    } catch (error) {
      console.error('Error fetching pedido by ID:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['ciudad', 'nombre', 'cantidad', 'categoria', 'url_imagen', 'descripcion', 'id_producto', 'precio_total', 'vendedor_telefono', 'vendedor_direccion', 'vendedor_direccion_referencia', 'vendedor_direccion_coordenadas'];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      console.error('Invalid operation:', updates);
      res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const pedido = await PedidoModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!pedido) {
        console.error('Pedido not found:', req.params.id);
        res.status(404).send();
      } else {
        res.send(pedido);
      }
    } catch (e) {
      console.error('Error patching pedido by ID:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // Add logging middleware
  public useLoggerMiddleware = loggerMiddleware;
}
