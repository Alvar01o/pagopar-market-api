import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import request from 'request-promise';
import sha1 from 'sha1';
import { loggerMiddleware } from '../middlewares/logger';
import config from 'config';

/** Models */
import CompradorModel from '../models/comprador.model';
import ItemModel, { IItem } from '../models/item.model';
import PedidoModel from '../models/pedido.model';
import OrdenModel from '../models/orden.model';

/** interfaces */
import IRespuestaPedido from '../interfaces/respuesta_pedido.interface';
import IRespuestaPago from '../interfaces/respuesta_pago.interface';
import IMetodoAex from '../interfaces/metodo_aex.interfaces';

const ObjectId = mongoose.Types.ObjectId;

const comprobaciondeToken = (hashPedido: String, token: String) => {
  const token2 = sha1(String(config.get('TPV')) + hashPedido);
  return token2 === token;
};

export class PagoparController {
  protected THIS = this;

  public async hello(req: Request, res: Response) {
    try {
      return res.status(200).send({ msg: 'Pasarela a pagopar' });
    } catch (e) {
      console.error('Error in hello endpoint:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async create(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comprador', 'compras_items'];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      console.error('Invalid operation:', updates);
      return res.status(400).send({ error: 'Invalid Operation' });
    }

    let itemsId = [];
    try {
      // Add logic to handle items
      await this.handleItems(req.body.compras_items, itemsId);
      const pagoparInfo = await this.createPagoparOrder(req.body, itemsId);
      res.status(201).send(pagoparInfo);
    } catch (e) {
      console.error('Error creating pagopar order:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async resultado(req: Request, res: Response) {
    let params = req.params;
    try {
      const ordenInfo = await OrdenModel.findOne({ hash_pedido: params.hash }, ['-public_key', '-token', '-isDeleted', '-__v']).then(info => {
        info.pagado = resultado.pagado;
        info.cancelado = resultado.cancelado;
        info.forma_pago = resultado.forma_pago;
        info.forma_pago_identificador = resultado.forma_pago_identificador;
        info.fecha_pago = resultado.fecha_pago;
        info.numero_pedido = resultado.numero_pedido;
        let integrity = comprobaciondeToken(info.hash_pedido, resultado.token);
        if (integrity) {
          info
            .save()
            .then(() => {
              res.status(200).send([
                {
                  pagado: info.pagado,
                  forma_pago: info.forma_pago,
                  fecha_pago: info.fecha_pago,
                  monto: info.monto_total,
                  fecha_maxima_pago: info.fecha_maxima_pago,
                  hash_pedido: info.hash_pedido,
                  numero_pedido: info.numero_pedido,
                  cancelado: info.cancelado,
                  forma_pago_identificador: String(info.forma_pago_identificador),
                  token: resultado.token
                }
              ]);
            })
            .catch(error => {
              //error de guardado , o enviando respuesta.
              res.status(403).send([
                {
                  error: true,
                  mensaje: 'Error al guardar datos del pedido.',
                  debug: error
                }
              ]);
            });
        } else {
          //token invalido. guardar informacion del cliente. //hack
          res.status(403).send([
            {
              error: true,
              mensaje: 'Token invalido.'
            }
          ]);
        }
      });
    } catch (e) {
      console.error('Error fetching order by hash:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async respuesta(req: Request, res: Response) {
    let parametros = req.body;
    let resultado = parametros.resultado[0];
    let respuesta = parametros.respuesta;

    if (respuesta) {
      const OrdenInfo: any = await OrdenModel.findOne({ hash_pedido: resultado.hash_pedido }).then(info => {
        info.pagado = resultado.pagado;
        info.cancelado = resultado.cancelado;
        info.forma_pago = resultado.forma_pago;
        info.forma_pago_identificador = resultado.forma_pago_identificador;
        info.fecha_pago = resultado.fecha_pago;
        info.numero_pedido = resultado.numero_pedido;
        let integrity = comprobaciondeToken(info.hash_pedido, resultado.token);
        if (integrity) {
          info
            .save()
            .then(() => {
              res.status(200).send([
                {
                  pagado: info.pagado,
                  forma_pago: info.forma_pago,
                  fecha_pago: info.fecha_pago,
                  monto: info.monto_total,
                  fecha_maxima_pago: info.fecha_maxima_pago,
                  hash_pedido: info.hash_pedido,
                  numero_pedido: info.numero_pedido,
                  cancelado: info.cancelado,
                  forma_pago_identificador: String(info.forma_pago_identificador),
                  token: resultado.token
                }
              ]);
            })
            .catch(error => {
              //error de guardado , o enviando respuesta.
              res.status(403).send([
                {
                  error: true,
                  mensaje: 'Error al guardar datos del pedido.',
                  debug: error
                }
              ]);
            });
        } else {
          //token invalido. guardar informacion del cliente. //hack
          res.status(403).send([
            {
              error: true,
              mensaje: 'Token invalido.'
            }
          ]);
        }
      });
    } else {
      console.error('Invalid parameters:', parametros);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getCategorias(req: Request, res: Response) {
    const data = { token: sha1(config.get('TPV') + 'CATEGORIAS'), token_publico: config.get('TPU') };
    try {
      const pp_response = await request(
        {
          url: config.get('URL_PAGOPAR_API') + 'categorias/1.1/traer',
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          json: data
        },
        (error, { body }) => {
          if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
          } else {
            return res.status(201).send(body);
          }
        }
      );
    } catch (e) {
      console.error('Error fetching categories:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getCiudades(req: Request, res: Response) {
    const data = { token: sha1(config.get('TPV') + 'CIUDADES'), token_publico: config.get('TPU') };
    try {
      const pp_response = await request(
        {
          url: config.get('URL_PAGOPAR_API') + 'ciudades/1.1/traer',
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          json: data
        },
        (error, { body }) => {
          if (error) {
            console.error('Error fetching cities:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
          } else {
            return res.status(201).send(body);
          }
        }
      );
    } catch (e) {
      console.error('Error fetching cities:', e);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // Add logging middleware
  public useLoggerMiddleware = loggerMiddleware;
}
