import { DetallePedido } from './pedido-detalle';


export interface Pedido {
    clienteId: number;
    detalles: DetallePedido[];
  }