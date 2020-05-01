import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ICategoria extends mongoose.Document {
  descripcion: String;
  nombre: String;
  isDeleted?: Boolean;
}
const categoriaSchema = new Schema(
  {
    descripcion: { type: String, required: false, default: '', trim: true, index: false },

    nombre: { type: String, required: true, trim: true, index: false },

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

export default mongoose.model('Categoria', categoriaSchema, 'categorias');
