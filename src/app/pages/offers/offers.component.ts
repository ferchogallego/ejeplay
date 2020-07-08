import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  load = false;
  dolar = false;
  precioDolar: any;
  usd: number;
  ofertas: any;
  constructor(private productoSvc: ProductsService,
              private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.productoSvc.search = true;
    this.productoSvc.loadGamesForOffer()
                    .subscribe(res => {
                      this.ofertas = res;
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

}
