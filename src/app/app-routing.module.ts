import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { InventarioComponent } from './admin/inventario/inventario.component';
import { ProductosComponent } from './admin/productos/productos.component';
import { EditarProductoComponent } from './admin/editar-producto/editar-producto.component';
import { UpdateSliderComponent } from './admin/update-slider/update-slider.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { JuegosPS4Component } from './pages/juegos-ps4/juegos-ps4.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { RequestComponent } from './pages/request/request.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ResponsePayuComponent } from './pages/response-payu/response-payu.component';
import { OffersComponent } from './pages/offers/offers.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { VentasComponent } from './admin/ventas/ventas.component';



const routes: Routes = [
  { path: 'home', component: InicioComponent},
  { path: 'administrador', component: InventarioComponent},
  { path: 'producto/:id', component: ProductosComponent},
  { path: 'editar/:id', component: EditarProductoComponent},
  { path: 'slider', component: UpdateSliderComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'catalogo', component: JuegosPS4Component},
  { path: 'ofertas', component: OffersComponent},
  { path: 'preguntas', component: PreguntasComponent},
  { path: 'detalle/:id', component: DetalleComponent},
  { path: 'ventas', component: VentasComponent},
  { path: 'info', component: PurchasesComponent, canActivate: [AuthGuard]},
  { path: 'solicitudes', component: RequestComponent, canActivate: [AuthGuard]},
  { path: 'confirmacion', component: ResponsePayuComponent, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
