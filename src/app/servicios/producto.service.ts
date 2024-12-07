import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Producto } from '../modelos/producto';
import { Categoria } from '../modelos/categoria';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlBase = "http://localhost:8080/inventario-app/productos"

  constructor(private clienteHttp: HttpClient) { }

  obtenerProductosLista() : Observable<Producto[]>{
    return this.clienteHttp.get<Producto[]>(this.urlBase);
  } 

  agregarProducto(producto: Producto): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.clienteHttp.post(this.urlBase, producto, { headers });
  }

  obtenerProductoPorId(id: number){
    return this.clienteHttp.get<Producto>(`${this.urlBase}/${id}`);
  }

  editarProducto(id: number, producto: any): Observable<any> {
    const url = `${this.urlBase}/${id}`; // Asegúrate de que `urlBase` esté correctamente definido
    return this.clienteHttp.put(url, producto); // Usa `put` para actualizar datos
  }

  eliminarProducto(id: number) : Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.clienteHttp.get<Categoria[]>('http://localhost:8080/inventario-app/categoria'); // Ajusta la URL según sea necesario
  }
}
