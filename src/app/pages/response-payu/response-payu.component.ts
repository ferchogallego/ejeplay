import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-response-payu',
  templateUrl: './response-payu.component.html',
  styleUrls: ['./response-payu.component.scss']
})
export class ResponsePayuComponent implements OnInit {

  perfilUser: any;
  idUser: string;
  referencia: number;
  resultado: any;
  public user = this.authSvc.afAuth.user;

  constructor( private activatedRoute: ActivatedRoute,
               private productoSvc: ProductsService,
               private authSvc: AuthService,
               private router: Router) { }

  ngOnInit(): void {
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.idUser = this.perfilUser.uid;
      this.referencia = this.activatedRoute.snapshot.queryParams.referenceCode;
      const refer = this.referencia.toString();
      if (this.activatedRoute.snapshot.queryParams.transactionState === '4'){
        Swal.fire({
          title: 'Venta Aprobada...',
          text: 'El pedido se envió exitosamente',
          icon: 'success',
          allowOutsideClick: false,
          showCloseButton: true
        });
        this.productoSvc.validateSale(this.idUser, refer).subscribe(res => {
           this.resultado = res;
           const id = this.resultado[0].id;
           this.productoSvc.updateSaleAccepted(id).then( resultado => {
           }).catch(err => {
            Swal.fire({
              title: 'Error...',
              text: 'Algo salió mal!!!',
              icon: 'error',
              allowOutsideClick: false,
              showCloseButton: true
            });
          });
        });
    } else if (this.activatedRoute.snapshot.queryParams.transactionState === '6') {
      this.productoSvc.validateSale(this.idUser, refer).subscribe(res => {
        this.resultado = res;
        const id = this.resultado[0].id;
        this.productoSvc.updateSaleRejected(id).then(resultado => {
          Swal.fire({
            title: 'Venta rechazada',
            text: 'La venta no pudo finalizarse',
            icon: 'error',
            allowOutsideClick: false,
            showCloseButton: true
          });
        });
      });
    }
    });
  }

  openCatalogoAll(){
    this.productoSvc.ofertas = false;
    this.router.navigate(['/catalogo']);
   }
}
