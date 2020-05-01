import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 *  Coordenadas
 *  https://mongoosejs.com/docs/geojson.html
 */
export const CoordenadasSchema = new Schema({
  coordenadas: {
    type: [Number],
    required: false
  },
  type: {
    enum: ['Point'],
    required: false,
    type: String
  }
});
