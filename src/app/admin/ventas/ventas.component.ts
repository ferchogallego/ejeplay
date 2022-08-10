import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  delivery = false;
  lista: any;
  request: any;
  sail: any;
  constructor(private productoScv: ProductsService) { }

  ngOnInit(): void {
    this.productoScv.loadSalesAdmin().subscribe(res => {
      this.lista = res;
    });
  }

  filterByState(event: string){
    if (event !== 'todos') {
      this.lista = '';
      this.productoScv.loadSalesAdminByState(event)
                    .subscribe(res => {
                      this.lista = res;
                    });
    } else {
      this.productoScv.loadSalesAdmin().subscribe(res => {
        this.lista = res;
      });
    }
  }

  filterByRef(refer: string){
    this.lista = [];
    this.productoScv.loadSalesAdminByReference(refer)
                   .subscribe(res => {
                      this.lista = res;
                      if (res.length === 0) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Referencia no encontrada.',
                          text: 'Verifica la referencia ingresada.',
                        });
                        this.productoScv.loadSalesAdmin().subscribe(list => {
                          this.lista = list;
                        });
                      }
                   });
  }

  detailRequest(venta: any){
    console.log(venta);
    this.request = venta.carrito;
    if (venta.entrega) {
      this.delivery = true;
      this.sail = venta;
    }
  }

 aprobarVenta(idSale: string){
  Swal.fire({
    title: 'Está seguro?',
    text: 'Se va a aprobar esta venta',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, aprobar!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.productoScv.pedidosAprobado(idSale);
      Swal.fire(
        'Aceptada!',
        'Venta confirmada.',
        'success'
      );
    }
  });
 }

  deny(idSale: string){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a eliminar esta venta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(idSale);
        this.productoScv.pedidosCancelados(idSale);
        Swal.fire(
          'Borrado!',
          'Venta eliminada del sistema.',
          'success'
        );
      }
    });
  }
}
