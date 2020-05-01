/** Models */

const axios = require('axios');
const api_base = 'http://pp-zolutio.herokuapp.com';
const TestHeader = '[ Pagopar ] >> ';

const product = {
  nombre: 'Desarrollo web',
  descripcion: 'Desarrollo de api',
  precio: 1000,
  photo: '',
  descuento: 0,
  tipo_descuento: ''
};

const item = {
  ciudad: '1',
  cantidad: 1,
  categoria: '909',
  public_key: '98b97ce494801bf26575a5c4ff2d4f14',
  url_imagen: '',
  vendedor_telefono: '',
  vendedor_direccion: '',
  vendedor_direccion_referencia: '',
  vendedor_direccion_coordenadas: ''
};

const comprador = {
  ruc: '3692882-8',
  email: 'alvar01omer@gmail.com',
  ciudad: '82',
  nombre: 'alvaro Mercado',
  telefono: '0975193642',
  direccion: '',
  documento: '3692882',
  coordenadas: '',
  razon_social: 'Alvaro Mercado',
  tipo_documento: 'CI',
  direccion_referencia: ''
};

const byPass = response => {
  //    await printResponse(response);
  return response;
};

const printResponse = (someResponse = '') => {
  console.log(someResponse.data);
};

const addProduct = async function() {
  return await axios({
    url: api_base + '/producto',
    method: 'POST',
    data: product
  }).then(async function(response) {
    return response.data;
  });
};

const addItem = async function(producto, callback = undefined) {
  if (producto != undefined) {
    const prod = producto;
    const it = item;
    it.id_producto = prod._id;
    return await axios({
      url: api_base + '/items',
      method: 'POST',
      data: it
    }).then(async function(response) {
      return response.data;
    });
  }
};

const addComprador = async function() {
  return await axios({
    url: api_base + '/compradores',
    method: 'POST',
    data: comprador
  }).then(async function(response) {
    return response.data;
  });
};

const addOrder = async function(info) {
  return await axios({
    url: api_base + '/pagopar',
    method: 'POST',
    data: info
  }).then(async function(response) {
    return response.data;
  });
};

describe('Creando una Orden.', function() {
  this.timeout(10000);
  let productoR = undefined;
  let itemR = undefined;
  let compradorR = undefined;
  let OrdenR = undefined;

  it(TestHeader + 'Creando Producto', async function() {
    productoR = await addProduct();
  });

  it(TestHeader + 'Creando Item', async function() {
    itemR = await addItem(productoR, byPass);
  });

  it(TestHeader + 'Creando Comprador', async function() {
    compradorR = await addComprador();
  });

  it(TestHeader + 'Creando Orden', async function() {
    let info = {
      comprador: compradorR._id,
      compras_items: [itemR._id]
    };
    OrdenR = await addOrder(info);
    console.log(OrdenR);
  });
});
