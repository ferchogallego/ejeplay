import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  ofertas: any;
  ofertas1: any;
  ofertas2: any;

  dolar = false;
  precioDolar: any;
  usd: number;

  public usr = this.authSvc.afAuth.user;

  constructor(private productoSvc: ProductsService,
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

    this.productoSvc.loadGamesForOffer()
    .subscribe(res => {
      this.ofertas = res;
    });

    this.productoSvc.loadStarterOffers2()
    .subscribe (res => {
      this.ofertas2 = res;
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
  openGame(juego: string){
    this.router.navigate([`/detalle/${juego}`]);
  }

  openCatalogInOffer(){
    this.productoSvc.ofertas = true;
    this.router.navigate(['/catalogo']);
  }
  openCatalogoAll(){
    this.productoSvc.ofertas = false;
    this.router.navigate(['/catalogo']);
   }
}
