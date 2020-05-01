import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { CompradorRoutes } from './routes/comprador.routes';
import { ItemRoutes } from './routes/item.routes';
import { PagoparRoutes } from './routes/pagopar.routes';
import { PedidoRoutes } from './routes/pedido.routes';
import { ProductoRoutes } from './routes/producto.routes';
class App {
  public app: express.Application = express();

  // routes
  public compradorRoutes: CompradorRoutes = new CompradorRoutes();
  public itemRoutes: ItemRoutes = new ItemRoutes();
  public pedidoRoutes: PedidoRoutes = new PedidoRoutes();
  public pagoparRoutes: PagoparRoutes = new PagoparRoutes();
  public productoRoutes: ProductoRoutes = new ProductoRoutes();

  public dbUrl: string = config.get('database');

  constructor() {
    this.config();
    this.mongoSetup();

    // setting up the routes
    this.compradorRoutes.routes(this.app);
    this.itemRoutes.routes(this.app);
    this.pedidoRoutes.routes(this.app);
    this.pagoparRoutes.routes(this.app);
    this.productoRoutes.routes(this.app);
  }

  private config(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // serving static files
    // this.app.use(express.static('public'));
  }

  private mongoSetup(): void {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    mongoose.connect(this.dbUrl, options);
  }
}

export default new App().app;
