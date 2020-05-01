export default interface IRespuestaPago {
  respuesta: Boolean;
  resultado: {
    data?: String;
    pagado: Boolean;
    forma_pago: String;
    fecha_pago: any;
    monto: Number;
    fecha_maxima_pago: any;
    hash_pedido: String;
    numero_pedido: String;
    cancelado: Boolean;
    forma_pago_identificador: String;
    token: String;
  };
}
