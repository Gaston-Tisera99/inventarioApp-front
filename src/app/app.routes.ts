import { Routes } from '@angular/router';
import { AgregarProductoComponent } from './productos/agregar-producto/agregar-producto.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';
import { ProductoListaComponent } from './productos/producto-lista/producto-lista.component';
import {ClienteListaComponent} from './clientes/cliente-lista/cliente-lista.component'


//http:localhost:4200/productos
export const routes: Routes = [
    {path: 'productos', component: ProductoListaComponent},
    {path: '', redirectTo: 'productos', pathMatch: 'full'},
    {path: 'agregar-producto', component: AgregarProductoComponent},
    {path: 'editar-producto/:id', component: EditarProductoComponent},
    {path: 'clientes', component: ClienteListaComponent},
];
