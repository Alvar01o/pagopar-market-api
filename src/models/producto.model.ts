import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { any } from 'bluebird';

const Schema = mongoose.Schema;

export interface IProducto extends mongoose.Document {
  _id: Number;
  nombre: String;
  descripcion: String;
  precio: Number;
  photo: mongoose.Schema.Types.ObjectId;
  descuento: Number;
  tipo_descuento: String;
  isDelete?: Boolean;
  seq?: Number;
}

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, index: false },
    descripcion: { type: String, required: false, default: '', trim: true, index: false },
    precio: { type: Number, required: false, index: false },
    descuento: { type: Number, required: false, index: false },
    tipo_descuento: { type: String, required: false, default: '', trim: true, index: false },
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
productoSchema.plugin(autoIncrement.plugin, 'Producto');

export default mongoose.model<IProducto>('Producto', productoSchema, 'productos');
