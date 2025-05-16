import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlBase = "http://localhost:8080/inventario-app/categorias"

  constructor(private httpClient: HttpClient) {}

    obtenerCategoriasLista(): Observable<Categoria[]> { 
      return this.httpClient.get<Categoria[]>(this.urlBase);
    }

    agregarCategoria(categoria: Categoria) : Observable<Object>{
      return this.httpClient.post(this.urlBase, categoria);
    }

    actualizarCategoria(id: number, categoria: Categoria): Observable<Object> {
      return this.httpClient.put(`${this.urlBase}/${id}`, categoria);
    }

    eliminarCategoria(id: number) : Observable<Object>{
      return this.httpClient.delete(`${this.urlBase}/${id}`)
    }
    
    actualizarEstadoCategoria(id: number, status: number): Observable<Categoria> {
      return this.httpClient.put<Categoria>(`${this.urlBase}/${id}/status`, { status });
    }
    
  
}
