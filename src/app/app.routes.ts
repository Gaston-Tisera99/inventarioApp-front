import { Routes } from '@angular/router';
import { ProductoListaComponent } from './productos/producto-lista/producto-lista.component';
import {ClienteListaComponent} from './clientes/cliente-lista/cliente-lista.component'
import { CategoriasComponent } from './categorias/categorias.component';
import { PedidoFormComponent } from './pedidos/pedido-form/pedido-form.component';


//http:localhost:4200/productos
export const routes: Routes = [
    {path: 'productos', component: ProductoListaComponent},
    {path: '', redirectTo: 'productos', pathMatch: 'full'},
    {path: 'clientes', component: ClienteListaComponent},
    {path: 'categorias', component: CategoriasComponent},
    {path: 'pedidos', component: PedidoFormComponent}
];
