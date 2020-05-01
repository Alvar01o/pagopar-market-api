import { Request, Response } from 'express';
import mongoose from 'mongoose';

import ItemModel from '../models/item.model';
import ProductoModel from '../models/producto.model';

const ObjectId = mongoose.Types.ObjectId;

export class ItemController {
  public async create(req: Request, res: Response) {
    const items = new ItemModel(req.body);
    const productID = req.body.id_producto;
    //validacion para id_producto
    const producto = await ProductoModel.findOne({ _id: productID });
    items.precio_total = Number(producto.precio) * Number(items.cantidad);
    items.nombre = producto.nombre;
    items.descripcion = producto.descripcion;
    try {
      await items.save();
      res.status(201).send(items);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const items = await ItemModel.find({});
      res.send(items);
    } catch (e) {
      res.status(404).send();
    }
  }

  public async getById(req: Request, res: Response) {
    const ID = req.params.id;
    try {
      const item = await ItemModel.findById(ID);
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
      const item = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
