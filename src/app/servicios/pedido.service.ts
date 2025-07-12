import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Pedido} from '../../app/modelos/pedido'

@Injectable({
    providedIn: 'root'
  })

export class PedidoService {

    private urlBase = "http://localhost:8080/inventario-app/pedidos"

    constructor(private clienteHttp: HttpClient) { }

    crearPedido(pedido: Pedido): Observable<any> {
        return this.clienteHttp.post<Pedido>(this.urlBase, pedido);
    }
}