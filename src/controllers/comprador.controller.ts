import { Request, Response } from 'express';
import CompradorModel from '../models/comprador.model';
import loggerMiddleware from '../middlewares/logger';

export class CompradorController {
  public async create(req: Request, res: Response) {
    const comprador = new CompradorModel(req.body);
    try {
      await comprador.save();
      res.status(201).send(comprador);
    } catch (e) {
      console.error('Error creating comprador:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const compradores = await CompradorModel.find({});
      res.send(compradores);
    } catch (e) {
      console.error('Error fetching all compradores:', e);
      res.status(500).send({ error: 'Internal Server Error' });
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
      console.error('Error fetching comprador by ID:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async patchById(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nombre', 'direccion', 'email', 'ruc', 'ci', 'ciudad', 'coordenadas', 'telefono', 'direccion_referencia'];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      console.error('Invalid operation:', updates);
      res.status(400).send({ error: 'Invalid Operation' });
    }

    try {
      const comprador = await CompradorModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!comprador) {
        console.error('Comprador not found:', req.params.id);
        res.status(404).send();
      } else {
        res.send(comprador);
      }
    } catch (e) {
      console.error('Error patching comprador by ID:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // Add logging middleware
  public useLoggerMiddleware = loggerMiddleware;
}
