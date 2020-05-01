import mongoose from 'mongoose';
import shortid from 'shortid';
import ItemModel, { IItem } from './item.model';

const Schema = mongoose.Schema;

export interface Orden extends mongoose.Document {
  comprador: any;
  compras_items: Array<mongoose.Types.ObjectId>;
  descripcion_resumen: String;
  fecha_maxima_pago: String;
  id_pedido_comercio: String;
  monto_total: any;
  public_key: String;
  tipo_pedido: String;
  token: String;
  cancelado?: boolean;
  pagado?: boolean;
  forma_pago_identificador?: Number;
  numero_pedido?: String;
  forma_pago?: String;
  fecha_pago?: String;
  hash_pedido?: String;
  isDeleted?: boolean;
}

const OrdenSchema: mongoose.Schema = new Schema(
  {
    comprador: { type: mongoose.Schema.Types.Mixed, required: true, index: false },

    compras_items: { type: Array, required: true, default: '', trim: true, index: false },

    descripcion_resumen: { type: String, required: false, index: false },

    fecha_maxima_pago: { type: String, required: false, default: '', trim: true, index: false },

    id_pedido_comercio: { type: String, required: false, trim: true, index: false },

    monto_total: { type: Number, required: false, default: '', trim: true, index: false },

    public_key: { type: String, required: false, default: undefined, index: false },

    tipo_pedido: { type: String, required: false, index: false },

    token: { type: String, required: false, default: '', trim: true, index: false },

    hash_pedido: { type: String, required: false, default: '', trim: true, index: false },

    forma_pago: { type: String, required: false, default: '', trim: true, index: false },

    cancelado: { type: Boolean, default: false, index: true },

    fecha_pago: { type: String, required: false, default: '', trim: true, index: false },

    numero_pedido: { type: String, required: false, default: '', trim: true, index: false },

    pagado: { type: Boolean, default: false, index: true },

    forma_pago_identificador: { type: Number, required: false, default: '', trim: true, index: false },
    /**
     *  used for virtual deleting of records
     */
    isDeleted: { type: Boolean, default: false, index: true },

    createdAt: { type: Date, default: Date.now, index: false },

    updatedAt: { type: Date, default: Date.now, index: false }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<Orden>('Orden', OrdenSchema);
