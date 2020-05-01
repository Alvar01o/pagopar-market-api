export default interface IRespuestaPedido {
  respuesta: Boolean;
  resultado?: {
    data: String; // hash del pepdido
  };
}
