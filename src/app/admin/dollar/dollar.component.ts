import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dollar',
  templateUrl: './dollar.component.html',
  styleUrls: ['./dollar.component.scss']
})
export class DollarComponent implements OnInit {

  dollar: any;
  dll: number;
  constructor(private productoSvc: ProductsService) { }

  ngOnInit(): void {
    this.productoSvc.loadDollarPrice()
                    .subscribe(res => {
                     this.dollar = res;
                     this.dll = this.dollar[0].dolar;
                    });
  }

  precioDolar(precio: number){
    this.dll = precio;
  }

  updateDolar(id: string){
    this.productoSvc.changeDollarPrice(id, this.dll)
                    .then(res => {
                      Swal.fire(
                        'Dolar',
                        'Precio del dolar actualizado',
                        'success'
                      ).then(() => {
                        location.reload();
                      });
                    });
  }
}
