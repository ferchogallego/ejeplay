import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { ProductosComponent } from './admin/productos/productos.component';
import { InventarioComponent } from './admin/inventario/inventario.component';

import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { EditarProductoComponent } from './admin/editar-producto/editar-producto.component';
import { UpdateSliderComponent } from './admin/update-slider/update-slider.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { JuegosPS4Component } from './pages/juegos-ps4/juegos-ps4.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { RequestComponent } from './pages/request/request.component';
import { ResponsePayuComponent } from './pages/response-payu/response-payu.component';
import { OffersComponent } from './pages/offers/offers.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { AccessComponent } from './admin/access/access.component';
import { DollarComponent } from './admin/dollar/dollar.component';
import { HttpClientModule } from '@angular/common/http';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    ProductosComponent,
    InventarioComponent,
    FilterPipe,
    AdminNavComponent,
    EditarProductoComponent,
    UpdateSliderComponent,
    LoginComponent,
    RegistroComponent,
    JuegosPS4Component,
    DetalleComponent,
    RequestComponent,
    ResponsePayuComponent,
    OffersComponent,
    PreguntasComponent,
    PurchasesComponent,
    VentasComponent,
    AccessComponent,
    DollarComponent,
    VerificacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: BUCKET, useValue: 'gs://ejeplay-7a38e.appspot.com'},
    AngularFireAuth
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
