import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juegos-ps4',
  templateUrl: './juegos-ps4.component.html',
  styleUrls: ['./juegos-ps4.component.scss']
})
export class JuegosPS4Component implements OnInit {

  rango = '0';
  juegos: any;
  filterProducto = '';
  dolar = false;
  precioDolar: any;
  usd: number;
  load = false;

  constructor(private productoSvc: ProductsService,
              private router: Router) { }

  ngOnInit(): void {
    this.productoSvc.catalogo = true;
    this.productoSvc.search = false;
    setTimeout(() => {
      this.load = true;
    }, 2000);
    if (this.productoSvc.termino) {
      this.filterProducto = this.productoSvc.termino;
      console.log(this.filterProducto);
    }
      // console.log('Dolar: ', this.productoSvc.divisa);
    this.productoSvc.cargarProductos()
      .subscribe (resp => {
        this.juegos = resp;
        // console.log(this.juegos);
      });

    if (this.productoSvc.ofertas === true) {
      this.productoSvc.termino = '';
      this.juegos = '';
      this.productoSvc.loadGamesForOffer()
                    .subscribe(res => {
                      this.juegos = res;
                    });
    }

    if (this.productoSvc.divisa === 'USD') {
      this.dolar = true;
      this.productoSvc.loadDolarValue()
                      .subscribe(res => {
                        this.precioDolar = res;
                        // tslint:disable-next-line: radix
                        this.usd = parseInt(this.precioDolar.dolar);
                        // console.log(this.usd);
                        // console.log(this.dolar);
                      });
    } else {
      this.dolar = false;
    }
  }

  value(event: any){
    this.rango = event;
  }

  findPrice(valor: string){
    this.productoSvc.termino = '';
    this.filterProducto = '';
    // tslint:disable-next-line: radix
    const cantidad = parseInt(valor);
    this.juegos = '';
    // console.log(cantidad);
    this.productoSvc.loadGamesForPrice(cantidad)
    .subscribe (resp => {
      this.juegos = resp;
      // console.log(this.juegos);
    });
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
                        // console.log(this.usd);
                        // console.log(this.dolar);
                      });
    } else {
      this.dolar = false;
      // console.log(this.dolar);
    }
  }

  openGame(juego: string){
    this.router.navigate([`/detalle/${juego}`]);
  }

  btnSearch(cate: string){
    // console.log(cate);
    this.productoSvc.termino = '';
    this.filterProducto = '';
    this.juegos = '';
    this.productoSvc.loadByCategory(cate)
                    .subscribe(res => {
                      this.juegos = res;
                    });
  }
  loadAllgames(){
    this.productoSvc.termino = '';
    this.juegos = '';
    this.filterProducto = '';
    this.productoSvc.cargarProductos()
    .subscribe (resp => {
      this.juegos = resp;
      // console.log(this.juegos);
    });
  }

  loadOffergames(){
    this.filterProducto = '';
    this.productoSvc.termino = '';
    this.juegos = '';
    this.productoSvc.loadGamesForOffer()
                  .subscribe(res => {
                    this.juegos = res;
                  });
  }

}
