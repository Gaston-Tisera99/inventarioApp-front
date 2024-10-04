import { Component } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  standalone: true,  // Asegúrate de que esta opción esté habilitada
  imports: [CommonModule, FormsModule],  // Importa CommonModule aquí
})
export class ProductoListaComponent {
  productos: Producto[];
  selectedProducto: Producto | null = null;
  productoEditado: Producto | null = null;
  id:number = 1;

  constructor(private productoServicio : ProductoService, private enrutador : Router){}

  ngOnInit(){
    //Cargamos todos los productos
    this.obtenerProductos();
  }
  private obtenerProductos(){
    this.productoServicio.obtenerProductosLista().subscribe(
      (datos => {
          this.productos = datos;
      })
    );
  }

  openByDocument(producto: Producto) {
    if (producto && producto.idProducto) {
      this.selectedProducto = producto;
      this.productoEditado = { ...producto }; // Copia los datos para editar
      const modalElement = document.getElementById("myModal");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      console.warn('Producto no válido para abrir el modal');
    }
  }

  actualizarProducto() {
    if (this.selectedProducto && this.productoEditado) {
      this.productoServicio.editarProducto(this.selectedProducto.idProducto, this.productoEditado).subscribe({
        next: (datos) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Producto actualizado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.obtenerProductos();  // Actualiza la lista de clientes después de la edición
            this.closeModelByDocument();  // Cierra el modal
          });
        },
        error: (errores) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al actualizar el producto.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
          console.error('Error al actualizar el producto', errores);
        }
      });
    } else {
      console.warn('No hay producto seleccionado o producto Editado.');
    }
  }

  closeModelByDocument() {
    const modalElement = document.getElementById("myModal");
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  eliminarProducto(id: number){

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) =>{
      if(result.isConfirmed){
        this.productoServicio.eliminarProducto(id).subscribe(
          {
            next: (datos) =>{ 
              Swal.fire({
                title: '¡Éxito!',
              text: 'Producto eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK',
              }).then(() =>{
                this.obtenerProductos();
              });
            },
            error: (errores) => {
              Swal.fire({
                title: '¡Error!',
                text: 'Hubo un problema al eliminar el cliente.',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
              });
              console.log(errores);
            }
          });
      }
    });
    
  }
}

