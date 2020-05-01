import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import request from 'request-promise';
import sha1 from 'sha1';
import { logger } from '../utils';
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
    return res.status(200).send({ msg: 'Pasarela a pagopar' });
  }

  public async create(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comprador', 'compras_items'];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    let itemsId = [];
    
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Parameters error.' });
    }

    try {
      const orden = new OrdenModel();

      req.body.compras_items.forEach(element => {
        itemsId.push(new ObjectId(element));
      });

      const itemsInfo: any = await ItemModel.find({}, ['-__v','-_id','-createdAt','-updatedAt','-isDeleted','-peso','-largo','-ancho','-alto','-vendedor_email'])
        .where('_id')
        .in(itemsId);

      orden.monto_total = 0;

      itemsInfo.forEach((item: IItem, index) => {
        orden.monto_total += item.precio_total;
        itemsInfo[index].public_key = config.get('TPU');
      });

      const compradorInfo: any = await CompradorModel.findById(req.body.comprador, ['-__v',  '-_id',  '-createdAt',  '-updatedAt',  '-isDeleted']);
      orden.compras_items = itemsInfo;
      orden.tipo_pedido = 'VENTA-COMERCIO';
      orden.fecha_maxima_pago = moment()
        .add(2, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      orden.comprador = compradorInfo;
      // generate pedido
      const pedido = new PedidoModel({
        comprador: req.body.comprador,
        comprar_items: orden.compras_items,
        fecha_maxima_pago: orden.fecha_maxima_pago,
        monto_total: orden.monto_total,
        tipo_pedido: orden.tipo_pedido
      });

      await pedido
        .save()
        .then(response => {
          orden.token = sha1(
            ''
              .concat(config.get('TPV'))
              .concat(String(response._id))
              .concat(orden.monto_total)
          );
          orden.public_key = config.get('TPU');
          orden.id_pedido_comercio = response._id;
          orden.descripcion_resumen = '';
        })
        .catch(error => {
          logger.info(error);
        });

      const peticion = {
        token: orden.token,
        comprador: orden.comprador,
        public_key: orden.public_key,
        monto_total: orden.monto_total,
        tipo_pedido: orden.tipo_pedido,
        compras_items: orden.compras_items,
        fecha_maxima_pago: orden.fecha_maxima_pago,
        id_pedido_comercio: orden.id_pedido_comercio,
        descripcion_resumen: orden.descripcion_resumen
      };

      let pp_response = await request(
        {
          url: config.get('URL_PAGOPAR_API') + 'comercios/1.1/iniciar-transaccion',
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          json: peticion
        },
        (error, { body }) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
      logger.info('pp response >> ');
      if (pp_response.respuesta) {
        orden.hash_pedido = pp_response.resultado[0].data;
        await orden.save().then(() => {
          res.status(200).send({ error: false, url: 'https://www.pagopar.com/pagos/' + pp_response.resultado[0].data });
        });
      } else {
        //en caso de que pagopar retorne error
        res.status(404).send({ error: true, info: pp_response });
      }
    } catch (e) {
      res.status(404).send({ error: true, info: e });
    }
  }

  public async resultado(req: Request, res: Response) {
    let params = req.params;
    OrdenModel.findOne({ hash_pedido: params.hash }, ['-public_key', '-token', '-isDeleted', '-__v']).then(info => {
      res.status(200).send(info);
    });
  }
  /**
   *
   * @param req
   * @param res
   */
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
      res.status(403).send([
        {
          error: true,
          mensaje: 'Error de parametros.'
        }
      ]);
    }
  }

  public async getCategorias(req: Request, res: Response) {
    const data = { token: sha1(config.get('TPV') + 'CATEGORIAS'), token_publico: config.get('TPU') };
    const pp_response = await request(
      {
        url: config.get('URL_PAGOPAR_API') + 'categorias/1.1/traer',
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        json: data
      },
      (error, { body }) => {
        if (error) {
          return res.status(403).send(error);
        } else {
          return res.status(201).send(body);
        }
      }
    );
  }

  public async getCiudades(req: Request, res: Response) {
    const data = { token: sha1(config.get('TPV') + 'CIUDADES'), token_publico: config.get('TPU') };
    const pp_response = await request(
      {
        url: config.get('URL_PAGOPAR_API') + 'ciudades/1.1/traer',
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        json: data
      },
      (error, { body }) => {
        if (error) {
          return res.status(403).send(error);
        } else {
          return res.status(201).send(body);
        }
      }
    );
  }
}
