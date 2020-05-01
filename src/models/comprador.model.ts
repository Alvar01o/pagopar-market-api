import mongoose from 'mongoose';
import * as VALIDATOR from 'validator';
import { CoordenadasSchema } from './schemas/coordenadas.schema';

const Schema = mongoose.Schema;
export interface IComprador extends mongoose.Document {
  nombre: String;
  direccion: String;
  email: String;
  ruc: String;
  documento: String;
  razon_social: String;
  tipo_document: String;
  ciudad: String;
  coordenadas?: String;
  telefono: String;
  direccion_referencia: String;
  isDeleted?: Boolean;
}
const compradorSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, index: false },

    direccion: { type: String, required: false, default: '', trim: true, index: false },

    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String
      // validate: {
      //   validator(v) {
      //     let valid = false;
      //     if (VALIDATOR.isEmail(v)) {
      //       valid = true;
      //     }
      //     return valid;
      //   },
      //   message: (props: any) => 'Email invalido'
      // }
    },

    ruc: { type: String, required: false, default: '', trim: true, index: false },

    documento: { type: String, required: false, default: '', trim: true, index: false },

    razon_social: { type: String, required: false, default: '', trim: true, index: false },

    tipo_documento: { type: String, required: false, default: 'CI', trim: true, index: false },

    ciudad: { type: String, required: false, default: '', trim: true, index: false },

    coordenadas: { type: String, required: false, default: '', trim: true, index: false },

    telefono: {
      default: '',
      index: false,
      required: false,
      trim: true,
      type: String
      // validate: {
      //   validator(v) {
      //     let valid = false;
      //     if (v.length <= 30) {
      //       valid = true;
      //     }
      //     return valid;
      //   },
      //   message: props => 'Telefono demasiado largo'
      // }
    },

    direccion_referencia: { type: String, required: false, default: '', trim: true, index: false },

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

export default mongoose.model<IComprador>('Comprador', compradorSchema, 'compradores');
