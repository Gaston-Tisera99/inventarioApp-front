import { Categoria } from './categoria';

export class Producto {
    idProducto: number;
    categoria: Categoria;
    codigo: string;
    descripcion: string;
    precio: number | null;
    stock: number | null;
    cantidadTemp?: number;
}

