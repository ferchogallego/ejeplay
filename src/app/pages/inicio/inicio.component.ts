import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Router } from '@angular/router';

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
  ofertas1: any;
  ofertas2: any;

  dolar = false;
  precioDolar: any;
  usd: number;

  constructor(private productoSvc: ProductsService,
              private router: Router) { }

  selectCurrency: string;

  ngOnInit(): void {
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
                     console.log(this.imagen1);
                   });

    this.productoSvc.loadStarterGames()
    .subscribe (resp => {
      this.juegos = resp;
      console.log(this.juegos);
    });

    this.productoSvc.loadStarterOffers2()
    .subscribe (res => {
      this.ofertas2 = res;
      console.log(this.ofertas2);
    });

    this.productoSvc.loadStarterOffers1()
    .subscribe (res => {
      this.ofertas1 = res;
      console.log(this.ofertas1);
    });

    if (this.productoSvc.divisa === 'USD') {
      this.dolar = true;
      this.productoSvc.loadDolarValue()
                      .subscribe(res => {
                        this.precioDolar = res;
                        // tslint:disable-next-line: radix
                        this.usd = parseInt(this.precioDolar.dolar);
                        console.log(this.usd);
                        console.log(this.dolar);
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
                        console.log(this.usd);
                        console.log(this.dolar);
                      });
    } else {
      this.dolar = false;
      console.log(this.dolar);
    }
  }
  openGame(juego: string){
    this.router.navigate([`/detalle/${juego}`]);
  }
}
