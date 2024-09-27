import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductoService } from './servicios/producto.service';
import { ProductoListaComponent } from './productos/producto-lista/producto-lista.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ClienteListaComponent } from './clientes/cliente-lista/cliente-lista.component';
import { ClienteService } from '../app/servicios/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Utiliza CommonModule en lugar de BrowserModule
    HttpClientModule,
    ProductoListaComponent,
    ClienteListaComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  providers: [ProductoService, ClienteService]  // Proporcionar servicios si es necesario
})
export class AppComponent {
  title = 'inventario-app';
}

