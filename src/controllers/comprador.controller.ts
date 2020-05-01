import { Request, Response } from 'express';
import CompradorModel from '../models/comprador.model';

export class CompradorController {
  public async create(req: Request, res: Response) {
    const comprador = new CompradorModel(req.body);
    try {
      await comprador.save();
      res.status(201).send(comprador);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const comprador = await CompradorModel.find({});
      res.send(comprador);
    } catch (e) {
      res.status(404).send(e);
    }
  }

  public async getById(req: Request, res: Response) {
    const ID = req.params.id;
    try {
      const comprador = await CompradorModel.findById(ID);
      if (!comprador) {
        res.status(404).send();
      } else {
        res.status(201).send(comprador);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nombre', 'direccion', 'email', 'ruc', 'ci', 'ciudad', 'coordenadas', 'telefono', 'direccion_referencia'];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const comprador = await CompradorModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!comprador) {
        res.status(404).send();
      } else {
        res.send(comprador);
      }
    } catch (e) {
      res.status(404).send(e);
    }
  }
}
