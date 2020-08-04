import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  lista: any;
  request: any;
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
    this.lista = '';
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

  detailRequest(reference: string){
    this.productoScv.loadSaleByReference(reference)
                    .subscribe(res => {
                      this.request = res;
                    });
  }

  approve(reference: string, comprador: string){
    this.productoScv.updateSale(comprador, reference)
                    .subscribe(result => {
                      const id = result[0].id;
                      this.productoScv.updateSaleAccepted(id)
                          .then (sale => {
                            this.productoScv.pedidos(comprador, reference)
                                .subscribe(pedido => {
                                  if (pedido) {
                                    Swal.fire({
                                      title: 'Aprobada',
                                      text: 'La venta se aprobó correctamente',
                                      icon: 'success',
                                      showCancelButton: false,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Ok'
                                    }).then((aprobado) => {
                                      if (aprobado.value) {
                                        window.location.reload();
                                      }
                                    });
                                  }
                                });
                          });
                    });
  }

  deny(idSale: string){
    this.productoScv.pedidosCancelados(idSale)
                    .then(res => {
                      Swal.fire({
                        title: 'Eliminado',
                        text: 'El registro se ha borrado correctamente',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      });
                    });
  }
}
