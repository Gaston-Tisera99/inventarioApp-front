import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { FormsModule } from '@angular/forms';  
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css']  // Cambié 'styleUrl' a 'styleUrls'
})
export class AgregarProductoComponent {
  producto: Producto = new Producto();

  constructor(private productoServicio: ProductoService,
              private enrutador: Router){}

  onSubmit(){
    this.guardarProducto();
  }

  guardarProducto(){
    this.productoServicio.agregarProducto(this.producto).subscribe(
      {
        next: (datos) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Producto agregado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.irListaProductos();  // Navegar después de cerrar la alerta
          });
        },
        error: (error: any) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al agregar el producto.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
          console.log(error);
        }
      }
    );
  }

  irListaProductos(){
    this.enrutador.navigate(['/productos']);
  }
}
