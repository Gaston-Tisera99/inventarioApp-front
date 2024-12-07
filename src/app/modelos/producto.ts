import { Categoria } from './categoria';

export class Producto {
    idProducto: number;
    categoria: Categoria;
    codigo: string;
    descripcion: string;
    precio: number;
    stock: number;
}

