import { Component } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from '../../servicios/cliente.service';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editar-producto.component.html',
})
export class EditarProductoComponent {
  producto: Producto = new Producto();
  id: number;

  constructor(
    private productoServicio: ProductoService,
    private ruta: ActivatedRoute,
    private enrutador: Router
  ) {}

  ngOnInit() {
    this.id = this.ruta.snapshot.params['id'];
    this.productoServicio.obtenerProductoPorId(this.id).subscribe({
      next: (datos) => (this.producto = datos),
      error: (errores: any) => console.log(errores),
    });
  }

  onSubmit() {
    this.guardarProducto();
  }

  guardarProducto() {
    this.productoServicio.editarProducto(this.id, this.producto).subscribe({
      next: (datos) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto actualizado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.irProductoLista();  // Navegar después de cerrar la alerta
        });
      },
      error: (errores) => {
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un problema al actualizar el producto.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
        console.log(errores);
      },
    });
  }

  irProductoLista() {
    this.enrutador.navigate(['/productos']);
  }
}
