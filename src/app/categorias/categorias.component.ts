import { Component } from '@angular/core';
import { CategoriaService } from '../servicios/categoria.service';
import { Categoria } from '../modelos/categoria';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [DatePipe],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent {
  categorias : Categoria[] = [];
  selectedCategoria: Categoria | null = null;
  categoriaEditado: Categoria | null = null;
  nuevaCategoria: Categoria = {} as Categoria;

  constructor(private categoriaService: CategoriaService, private datePipe: DatePipe){}

  ngOnInit(){
    this.obtenerCategoria();
  }

  private obtenerCategoria(){
    this.categoriaService.obtenerCategoriasLista().subscribe(
      datos => {
        this.categorias = datos;
      }
    )
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }

 //agregar una nueva categoria

  AgregarCategoria() {
    this.categoriaService.agregarCategoria(this.nuevaCategoria).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
            text: 'Categoria creada con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
          console.log('Categoria creado', response);
          this.cerrarModalAgregar()
          this.obtenerCategoria();
        })
      },
      error: (error) => Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al crear la categoria.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      })
    });
  }

  modalAgregar(){
    const modalElement = document.getElementById("modalAgregarCategoria");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
  }

  cerrarModalAgregar() {
    const modalElement = document.getElementById("modalAgregarCategoria");
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


  modalEditar(categoria : Categoria){
    if (categoria && categoria.id) {
      this.selectedCategoria = categoria;
      this.categoriaEditado = { ...categoria }; // Copia los datos para editar
      const modalElement = document.getElementById("myModal");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      console.warn('Categoria no válido para abrir el modal');
    }
  }

  eliminarCategoria(id: number) {
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
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: (datos) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Categoria eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.obtenerCategoria(); // Refresca la lista de clientes
            });
          },
          error: (errores) => {
            Swal.fire({
              title: '¡Error!',
              text: 'Hubo un problema al eliminar la Categoria.',
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
