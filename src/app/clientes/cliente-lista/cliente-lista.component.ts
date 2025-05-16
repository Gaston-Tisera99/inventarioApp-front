import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../modelos/cliente';
import { ClienteService } from '../../servicios/cliente.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

 
@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-lista.component.html',
})
export class ClienteListaComponent {
  clientes: Cliente[] = [];
  selectedCliente: Cliente | null = null;
  clienteEditado: Cliente | null = null;
  id:number = 1;
  nuevoCliente: Cliente = {} as Cliente;
  
  constructor(private clienteServicio: ClienteService) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  
  private obtenerClientes() { 
    this.clienteServicio.obtenerClientesLista().subscribe(
      datos => {
        this.clientes = datos;
      }
    );
  }
  

  guardarCliente() {

    const camposRequeridos = [
      { campo: this.nuevoCliente.nombre, nombre: 'nombre'},
      {campo: this.nuevoCliente.apellido, nombre: 'apellido'},
      {campo: this.nuevoCliente.telefono, nombre: 'telefono'},
      {campo: this.nuevoCliente.dni, nombre: 'dni'},
      {campo: this.nuevoCliente.cuit, nombre: 'cuit'},
      {campo: this.nuevoCliente.email, nombre: 'email'},
    ];

    const campoFaltante = camposRequeridos.find(item => !item.campo);

    if(campoFaltante){
      Swal.fire({
        title: '!Campo Incompleto!',
        text: `Por favor, rellene el campo ${campoFaltante.nombre}.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    console.log('Producto guardado:', this.nuevoCliente);

    this.clienteServicio.agregarCliente(this.nuevoCliente).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
            text: 'Cliente creado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
          console.log('Cliente creado', response);
          this.cerrarModalAgregar()
          this.obtenerClientes();
        })
      },
      error: (error) => Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al crear el cliente.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      })
    });
  }

  
  modalAgregar(){

    this.nuevoCliente = {
      id: 0, // si se autogenera puedes dejarlo así
      nombre: '',
      apellido: '',
      telefono: null,
      dni: null,
      cuit: null,
      email: ''
    };

    const modalElement = document.getElementById("modalCliente");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
  } 

  cerrarModalAgregar() {
    const modalElement = document.getElementById("modalCliente");
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


  openByDocument(cliente: Cliente) {
    if (cliente && cliente.id) {
      this.selectedCliente = cliente;
      this.clienteEditado = { ...cliente }; // Copia los datos para editar
      const modalElement = document.getElementById("myModal");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      console.warn('Cliente no válido para abrir el modal');
    }
  }


  actualizarCliente() {
    if (this.selectedCliente && this.clienteEditado) {
      this.clienteServicio.editarCliente(this.selectedCliente.id, this.clienteEditado).subscribe({
        next: (datos) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Cliente actualizado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.obtenerClientes();  // Actualiza la lista de clientes después de la edición
            this.closeModelByDocument();  // Cierra el modal
          });
        },
        error: (errores) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al actualizar el cliente.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
          console.error('Error al actualizar el cliente', errores);
        }
      });
    } else {
      console.warn('No hay cliente seleccionado o clienteEditado.');
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

  eliminarCliente(id: number) {
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
        this.clienteServicio.eliminarCliente(id).subscribe({
          next: (datos) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Cliente eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.obtenerClientes(); // Refresca la lista de clientes
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


