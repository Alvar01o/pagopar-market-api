import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

export interface IPedido extends mongoose.Document {
  comprador: mongoose.Schema.Types.ObjectId;
  monto_total: Number;
  tipo_pedido: String;
  compras_items: [mongoose.Schema.Types.ObjectId];
  fecha_maxima_pago: Date;
  isDeleted?: Boolean;
}

const pedidoSchema = new Schema(
  {
    comprador: { type: Schema.Types.ObjectId, required: true, index: false },

    monto_total: { type: Number, required: false, index: false },

    tipo_pedido: { type: String, required: true, default: '', trim: true, index: false },

    compras_items: { type: [Schema.Types.ObjectId], required: true, index: false },

    fecha_maxima_pago: { type: Date, required: true, index: false },

    hash: { type: String, required: false, index: false },

    /**
     *  used for virtual deleting of records
     */
    isDeleted: { type: Boolean, default: false, index: true },

    /**
     *  timestamps
     */
    createdAt: { type: Date, default: Date.now, index: false },
    updatedAt: { type: Date, default: Date.now, index: false }
  },
  {
    timestamps: true
  }
);
autoIncrement.initialize(mongoose.connection);
pedidoSchema.plugin(autoIncrement.plugin, 'Pedido');

export default mongoose.model<IPedido>('Pedido', pedidoSchema, 'pedidos');
