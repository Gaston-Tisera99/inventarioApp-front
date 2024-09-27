import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlBase = 'http://localhost:8080/inventario-app/clientes';

  constructor(private httpClient: HttpClient) {}

  obtenerClientesLista(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.urlBase);
  }

  agregarCliente(cliente: Cliente) : Observable<Object>{
    return this.httpClient.post(this.urlBase, cliente)
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlBase}/${id}`);
  }

  editarCliente(id: number, cliente: Cliente): Observable<Object> {
    return this.httpClient.put(`${this.urlBase}/${id}`, cliente);
  }

  eliminarCliente(id: number) : Observable<Object>{
    return this.httpClient.delete(`${this.urlBase}/${id}`)
  }
}

