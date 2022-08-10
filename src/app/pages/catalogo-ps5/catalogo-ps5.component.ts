import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Productps5Service } from 'src/app/services/productps5.service';
import { ProductsService } from 'src/app/services/products.service';
import { PruebaService } from 'src/app/services/prueba.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-ps5',
  templateUrl: './catalogo-ps5.component.html',
  styleUrls: ['./catalogo-ps5.component.scss']
})
export class CatalogoPs5Component implements OnInit {

  rango = '0';
  juegos: any;
  cantidad: number;
  alfabetico: any;
  filterProducto = '';
  dolar = false;
  precioDolar: any;
  usd: number;
  load = false;

  constructor(private productoSvc: ProductsService,
              private ps5Svc: Productps5Service,
              private pruebaService: PruebaService,
              private router: Router) { }

  ngOnInit(): void {
    this.productoSvc.catalogo = true;
    this.productoSvc.search = false;
    setTimeout(() => {
      this.load = true;
    }, 1000);
    if (this.productoSvc.termino) {
      this.filterProducto = this.productoSvc.termino;
    }

    if (this.productoSvc.fisicos === true) {
      this.juegos = '';
      this.productoSvc.loadPhysicalProducts()
                    .subscribe(res => {
                      this.juegos = res[0];
                    });
    }

    if (this.productoSvc.ofertas === true) {
      this.productoSvc.termino = '';
      this.juegos = '';
      this.productoSvc.loadGamesForOffer()
                    .subscribe(res => {
                      this.juegos = res;
                    });
    }

    if (this.productoSvc.ofertas === false && this.productoSvc.fisicos === false
      || this.productoSvc.ofertas === undefined || this.productoSvc.fisicos === undefined) {
      this.pruebaService.cargarElementosPs5().subscribe(res => {
        this.juegos = res;
        this.alfabetico = res;
        this.cantidad = this.juegos.length;
        //console.log(this.juegos);
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

  openGame(juego: any){
    this.productoSvc.tipo = juego.tipo;
    if (juego.cantPpal === 0 && juego.cantSec === 0 ) {
      Swal.fire(
        'Agotado',
        'Pronto tendremos de nuevo este título',
        'question'
      );
    } else {
      this.router.navigate([`/detalleps5/${juego.id}`]);
    }
  }

  btnSearch(cate: string){
    this.productoSvc.termino = '';
    this.filterProducto = '';
    this.juegos = '';
    this.ps5Svc.loadByCategory(cate)
                    .subscribe(res => {
                      this.juegos = res;
                    });
  }
  loadAllgames(){
    this.productoSvc.termino = '';
    this.juegos = '';
    this.filterProducto = '';
    this.pruebaService.cargarElementosPs5().subscribe(res => {
      this.juegos = res;
      this.alfabetico = res;
      this.cantidad = this.juegos.length;
    });
  }

  loadOffergames(){
    this.filterProducto = '';
    this.productoSvc.termino = '';
    this.juegos = '';
    this.ps5Svc.loadGamesForOffer()
                  .subscribe(res => {
                    this.juegos = res;
                  });
  }

  filtrarBusqueda(event: string){
    this.juegos = [];
    if (event === 'alfabetico') {
      this.juegos = this.alfabetico;
    }
    if (event === 'fecha') {
      this.pruebaService.CargarElementosFecha().then(res => {
        this.juegos = res;
        this.cantidad = this.juegos.length;
      });
    }
    if (event === 'menor') {
      this.pruebaService.CargarElementosPrecioMmenor().then(res => {
        this.juegos = res;
        this.cantidad = this.juegos.length;
      });
    }
    if (event === 'mayor') {
      this.pruebaService.CargarElementosPrecioMayor().then(res => {
        this.juegos = res;
        this.cantidad = this.juegos.length;
      });
    }
  }

}
