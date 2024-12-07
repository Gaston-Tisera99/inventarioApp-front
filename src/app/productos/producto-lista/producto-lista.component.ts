import { Component } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../modelos/categoria';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  standalone: true,  // Asegúrate de que esta opción esté habilitada
  imports: [CommonModule, FormsModule],  // Importa CommonModule aquí
})
export class ProductoListaComponent {
  productos: Producto[] = [];
  selectedProducto: Producto | null = null;
  productoEditado: Producto | null = null;
  id: number = 1;
  nuevoProducto: Producto = {
    idProducto: 0,
    categoria: { id: 0, nombre: '', descripcion: '', datacreated: new Date(), status: 1 },  // Inicializa el objeto categoría
    codigo: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  
  
  categorias: Categoria[] = [];

  constructor(private productoServicio: ProductoService, private enrutador: Router) { }

  ngOnInit() {
    // Cargamos todos los productos
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.productoServicio.obtenerCategorias().subscribe(
      (datos) => this.categorias = datos,
      (error) => console.error('Error al cargar categorías:', error)
    );
  }

  private obtenerProductos() {
    this.productoServicio.obtenerProductosLista().subscribe(
      (datos) => {
        this.productos = datos;
        //console.log('Productos cargados:', this.productos); // Verifica que los productos se carguen correctamente
      },
      (error) => {
        console.error('Error al cargar productos:', error); // Manejo de errores
      }
    );
  }

  agregarProducto() {
    if (!this.nuevoProducto.descripcion || !this.nuevoProducto.precio || !this.nuevoProducto.categoria.id) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor complete todos los campos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
      return; // Prevenir la creación si hay campos vacíos
    }

    const productoConCategoriaId = {
      ...this.nuevoProducto,
      categoriaId: this.nuevoProducto.categoria?.id  // Solo incluye `categoriaId` en lugar de todo el objeto `categoria`
    };

    this.productoServicio.agregarProducto(productoConCategoriaId).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto creado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.cerrarModalAgregar();  // Cierra el modal usando la función restaurada
          this.obtenerProductos();
        });
      },
      error: (error) => {
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un problema al crear el producto.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
      }
    });
  }

  // Función para abrir el modal de agregar
  modalAgregar() {
    const modalElement = document.getElementById("modalAgregar");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Función para cerrar el modal
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

  cerrarModalAgregar() {
    const modalElement = document.getElementById('modalAgregar');
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
  

  // Función para abrir el modal de editar
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

  // Función para cargar el producto en el modal de edición
  editarProducto(producto: Producto) {
    this.productoEditado = { ...producto };  // Crea una copia del producto para evitar modificar el original directamente
    this.selectedProducto = producto; // Establece el producto seleccionado
  }

  actualizarProducto() {
    if (this.selectedProducto && this.selectedProducto.categoria) {
      const productoAEnviar = {
        idProducto: this.productoEditado?.idProducto,
        codigo: this.productoEditado?.codigo,
        descripcion: this.productoEditado?.descripcion,
        precio: this.productoEditado?.precio,
        stock: this.productoEditado?.stock,
        categoria_id: this.productoEditado?.categoria?.id,  // Usando el operador de encadenamiento opcional
      };
  
      // Llamada al servicio para actualizar el producto
      this.productoServicio.editarProducto(this.selectedProducto.idProducto, productoAEnviar).subscribe({
        next: (datos) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Producto actualizado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            console.error('Datos enviados al backend:', productoAEnviar);
            this.obtenerProductos(); // Refresca la lista de productos
            this.closeModelByDocument(); // Cierra el modal
          });
        },
        error: (errores) => {
          console.error('Error al actualizar:', errores);
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al actualizar el producto.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
          console.error('Error al actualizar el producto:', errores);
        }
      });
    } else {
      console.warn('No hay producto seleccionado o producto editado.');
    }
  }
  

  // Eliminar producto
  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServicio.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Producto eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.obtenerProductos();
            });
          },
          error: (errores) => {
            Swal.fire({
              title: '¡Error!',
              text: 'Hubo un problema al eliminar el producto.',
              icon: 'error',
              confirmButtonText: 'Intentar de nuevo',
            });
            console.error('Error al eliminar el producto', errores);
          }
        });
      }
    });
  }
}
