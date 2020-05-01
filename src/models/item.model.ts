import mongoose from 'mongoose';
import shortid from 'shortid';
import { CoordenadasSchema } from './schemas/coordenadas.schema';
import IMetodoAex from '../interfaces/metodo_aex.interfaces';

const Schema = mongoose.Schema;

export interface IItem extends mongoose.Document {
  nombre: String;
  ciudad: String;
  cantidad: Number;
  categoria: Number;
  url_imagen?: String;
  descripcion?: String;
  id_producto: String;
  precio_total: Number;
  peso: Number;
  largo: Number;
  ancho: Number;
  alto: Number;
  vendedor_telefono?: String;
  vendedor_email?: String;
  vendedor_direccion?: String;
  vendedor_direccion_referencia?: String;
  vendedor_direccion_coordenadas?: String;
  public_key: String;
  isDeleted?: boolean;
  opciones_envio: IMetodoAex;
}

const itemSchema: mongoose.Schema = new Schema(
  {
    nombre: { type: String, required: true, index: false },

    ciudad: { type: String, required: false, default: 82, trim: true, index: false },

    cantidad: { type: Number, required: true, index: false },

    categoria: { type: String, required: true, default: '', trim: true, index: false },

    url_imagen: { type: String, required: false, default: '', trim: true, index: false },

    descripcion: { type: String, required: false, default: '', trim: true, index: false },

    id_producto: { type: Number, required: true, index: false },

    precio_total: { type: Number, required: true, index: false },

    peso: { type: Number, required: false, default: 0, index: false },

    largo: { type: Number, required: false, default: 0, index: false },

    ancho: { type: Number, required: false, default: 0, index: false },

    alto: { type: Number, required: false, default: 0, index: false },
    opciones_envio: { type: mongoose.Schema.Types.Mixed, required: false, default: undefined, index: false },
    vendedor_telefono: {
      default: '',
      index: false,
      required: false,
      trim: true,
      type: String
    },
    vendedor_email: { type: String, required: false, default: '', trim: true, index: false },

    vendedor_direccion: { type: String, required: false, default: '', trim: true, index: false },

    vendedor_direccion_referencia: { type: String, required: false, default: '', trim: true, index: false },

    vendedor_direccion_coordenadas: { type: String, required: false, default: '', trim: true, index: false }, // CoordenadasSchema,

    public_key: { type: String, required: false, default: '', trim: true, index: false },

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

export default mongoose.model<IItem>('Item', itemSchema);
