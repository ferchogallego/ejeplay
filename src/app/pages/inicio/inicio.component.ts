import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Productps5Service } from 'src/app/services/productps5.service';
import { FisicosService } from 'src/app/services/fisicos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  load = false;
  slider: any;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  juegos: any;
  fisicos: any;
  ofertas1: any;
  ofertas2: any;

  dolar = false;
  precioDolar: any;
  usd: number;

  public usr = this.authSvc.afAuth.user;

  constructor(private productoSvc: ProductsService,
              private ps5Svc: Productps5Service,
              private fisicoSvc: FisicosService,
              private router: Router,
              private authSvc: AuthService) { }

  selectCurrency: string;

  ngOnInit(): void {
    this.usr.subscribe(usuario => {
      if (!usuario.emailVerified) {
        this.router.navigate(['/verificacion']);
      }
    });

    this.productoSvc.termino = '';
    this.productoSvc.catalogo = false;
    this.productoSvc.search = true;
    setTimeout(() => {
      this.load = true;
    }, 2000);

    this.productoSvc.cargarSlider()
                   .subscribe( resp => {
                     this.slider = resp;
                     // tslint:disable-next-line: no-unused-expression
                     this.imagen1 = this.slider.imagen1;
                     this.imagen2 = this.slider.imagen2;
                     this.imagen3 = this.slider.imagen3;
                   });

    this.productoSvc.loadStarterGames()
    .subscribe (resp => {
      this.juegos = resp;
    });

    this.fisicoSvc.loadPhysicalProducts()
    .subscribe(res => {
      this.fisicos = res;
    });

    this.productoSvc.loadStarterOffers1()
    .subscribe (res => {
      this.ofertas1 = res;
    });

    if (this.productoSvc.divisa === 'USD') {
      this.dolar = true;
      this.productoSvc.loadDolarValue()
                      .subscribe(res => {
                        this.precioDolar = res;
                        // tslint:disable-next-line: radix
                        this.usd = parseInt(this.precioDolar.dolar);
                      });
    } else {
      this.dolar = false;
    }
  }

  divisaSelected(event: string){
    if (event === 'USD') {
      this.dolar = true;
      this.productoSvc.divisa = event;
      this.productoSvc.loadDolarValue()
                      .subscribe(res => {
                        this.precioDolar = res;
                        // tslint:disable-next-line: radix
                        this.usd = parseInt(this.precioDolar.dolar);
                      });
    } else {
      this.dolar = false;
    }
  }
  openGame(juego: any){
    this.productoSvc.tipo = juego.tipo;
    if (juego.cantPpal === 0 && juego.cantSec === 0 ) {
      Swal.fire(
        'Agotado',
        'Pronto tendremos de nuevo este título',
        'question'
      );
    } else {
      this.router.navigate([`/detalle/${juego.id}`]);
    }
  }
  openGameFisico(juego: any){
    this.productoSvc.tipo = juego.tipo;
    if (juego.cantPpal === 0 && juego.cantSec === 0 ) {
      Swal.fire(
        'Agotado',
        'Pronto tendremos de nuevo este título',
        'question'
      );
    } else {
      this.router.navigate([`/detallefisicos/${juego.id}`]);
    }
  }

  openCatalogInOffer(){
    this.productoSvc.fisicos = false;
    this.productoSvc.ofertas = true;
    this.router.navigate(['/catalogo']);
  }
  openCatalogoAll(){
    this.productoSvc.fisicos = false;
    this.productoSvc.ofertas = false;
    this.router.navigate(['/catalogo']);
   }

   openCatalogInProds(){
    this.router.navigate(['/fisicos']);
   }
}
