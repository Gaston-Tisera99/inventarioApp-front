import { Component, OnInit } from '@angular/core';
import { PedidoService} from '../../servicios/pedido.service';
import { ProductoService } from '../../servicios/producto.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { ClienteService } from '../../servicios/cliente.service';
import { FormsModule } from '@angular/forms';


import { CommonModule } from '@angular/common';
import { Pedido } from '../../modelos/pedido';
import { DetallePedido } from '../../modelos/pedido-detalle';
import { Producto } from '../../modelos/producto';
import { Categoria } from '../../modelos/categoria';
import { Cliente } from '../../modelos/cliente';


@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pedido-form.component.html'
})
export class PedidoFormComponent {
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  clientes: Cliente[] = [];

  clienteId: number = 0;
  categoriaSeleccionada: number = 0;

  detalles: DetallePedido[] = [];

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.productoService.obtenerProductosLista().subscribe(p => this.productos = p);
    this.categoriaService.obtenerCategoriasLista().subscribe(c => this.categorias = c);
    this.clienteService.obtenerClientesLista().subscribe(c => this.clientes = c);
    
  }

  filtrarProductosPorCategoria() {
    const categoriaId = Number(this.categoriaSeleccionada);
    this.productosFiltrados = this.productos
      .filter(prod => prod.categoria.id === categoriaId)
      .map(p => ({ ...p, cantidadTemp: 1 }));
  }
  
  

  agregarProducto(productoId: number, cantidad: number) {
    const existente = this.detalles.find(d => d.productoId === productoId);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.detalles.push({ productoId, cantidad });
    }
  }

  obtenerDescripcion(productoId: number): string {
    const producto = this.productos.find(p => p.idProducto === productoId);
    return producto ? producto.descripcion : '';
  }
  
  obtenerPrecio(productoId: number): number {
    const producto = this.productos.find(p => p.idProducto === productoId);
    return producto?.precio ?? 0;  // si precio es null o undefined devuelve 0
  }
  
  
  

  enviarPedido() {
    const pedido: Pedido = {
      clienteId: this.clienteId,
      detalles: this.detalles
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: () => alert('✅ Pedido creado correctamente'),
      error: () => alert('❌ Error al crear el pedido'),
    });
  }
}
