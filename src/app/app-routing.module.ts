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
import { AdminGuard } from './guards/admin.guard';
import { ResponsePayuComponent } from './pages/response-payu/response-payu.component';
import { OffersComponent } from './pages/offers/offers.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { AccessComponent } from './admin/access/access.component';
import { DollarComponent } from './admin/dollar/dollar.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { CuponesComponent} from './admin/cupones/cupones.component';
import { ComentariosComponent } from './admin/comentarios/comentarios.component';
import { ContrasenaComponent } from './pages/contrasena/contrasena.component';
import { BuyPageComponent } from './pages/buy-page/buy-page.component';
import { CatalogoFisicoComponent } from './pages/catalogo-fisico/catalogo-fisico.component';
import { CatalogoPs5Component } from './pages/catalogo-ps5/catalogo-ps5.component';
import { DetallefisicosComponent } from './pages/detallefisicos/detallefisicos.component';
import { Detalleps5Component } from './pages/detalleps5/detalleps5.component';


const routes: Routes = [
  { path: 'home', component: InicioComponent},
  { path: 'administrador', component: InventarioComponent},
  { path: 'producto/:id', component: ProductosComponent, canActivate: [AdminGuard]},
  { path: 'editar/:id', component: EditarProductoComponent, canActivate: [AdminGuard]},
  { path: 'slider', component: UpdateSliderComponent, canActivate: [AdminGuard]},
  { path: 'admin', component: AccessComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'verificacion', component: VerificacionComponent},
  { path: 'catalogo', component: JuegosPS4Component},
  { path: 'catalogo-ps5', component: CatalogoPs5Component},
  { path: 'fisicos', component: CatalogoFisicoComponent},
  { path: 'detalleps5/:id', component: Detalleps5Component},
  { path: 'detallefisicos/:id', component: DetallefisicosComponent},
  { path: 'ofertas', component: OffersComponent},
  { path: 'preguntas', component: PreguntasComponent},
  { path: 'contrasena', component: ContrasenaComponent},
  { path: 'detalle/:id', component: DetalleComponent},
  { path: 'ventas', component: VentasComponent, canActivate: [AdminGuard]},
  { path: 'cupones', component: CuponesComponent, canActivate: [AdminGuard]},
  { path: 'comentarios', component: ComentariosComponent, canActivate: [AdminGuard]},
  { path: 'dolar', component: DollarComponent, canActivate: [AdminGuard]},
  { path: 'info', component: PurchasesComponent, canActivate: [AuthGuard]},
  { path: 'solicitudes', component: RequestComponent, canActivate: [AuthGuard]},
  { path: 'finalizar', component: BuyPageComponent, canActivate: [AuthGuard]},
  { path: 'favoritos', component: FavoritosComponent, canActivate: [AuthGuard]},
  { path: 'confirmacion', component: ResponsePayuComponent, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: '/home'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
