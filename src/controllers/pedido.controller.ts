import { Request, Response } from 'express';
import PedidoModel from '../models/pedido.model';

export class PedidoController {
  public async create(req: Request, res: Response) {
    const pedidos = new PedidoModel(req.body);
    try {
      await pedidos.save();
      res.status(201).send(pedidos);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const pedidos = await PedidoModel.find({});
      res.send(pedidos);
    } catch (e) {
      res.status(404).send();
    }
  }

  public async getById(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const pedido = await PedidoModel.findById(_id);
      if (!pedido) {
        res.status(404).send();
      } else {
        res.status(201).send(pedido);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'ciudad',
      'nombre',
      'cantidad',
      'categoria',
      'url_imagen',
      'descripcion',
      'id_producto',
      'precio_total',
      'vendedor_telefono',
      'vendedor_direccion',
      'vendedor_direccion_referencia',
      'vendedor_direccion_coordenadas'
    ];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const pedido = await PedidoModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!pedido) {
        res.status(404).send();
      } else {
        res.send(pedido);
      }
    } catch (e) {
      res.status(404).send(e);
    }
  }
}
