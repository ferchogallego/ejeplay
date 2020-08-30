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
    }
    this.productoSvc.cargarProductos()
      .subscribe (resp => {
        this.juegos = resp;
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
    this.productoSvc.loadGamesForPrice(cantidad)
    .subscribe (resp => {
      this.juegos = resp;
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
                      });
    } else {
      this.dolar = false;
    }
  }

  openGame(juego: string){
    this.router.navigate([`/detalle/${juego}`]);
  }

  btnSearch(cate: string){
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
