import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Md5 } from 'md5-typescript';
import { SaleI } from '../../shared/sale.interface';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  load = false;
  dolar = false;
  precioDolar: any;
  usd: number;
  perfilUser: any;
  idUser: string;
  email: string;
  public user = this.authSvc.afAuth.user;
  compras: any;
  game: any;
  subtotal: number;
  liquidacion: number;
  descripcion: string;
  apiKey = '4Vj8eK4rloUd272L48hsrarnUA';
  merchantid = '508029';
  accountId = '512321';
  cifrado: string;
  moneda: 'COP';
  reference: number;

  constructor(private productoSvc: ProductsService,
              private authSvc: AuthService,
              ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.idUser = this.perfilUser.uid;
      this.email =  this.perfilUser.email;
      // console.log('Usuario: ', this.perfilUser);
      this.productoSvc.cargarCompras(this.idUser)
                      .subscribe(res => {
                        this.compras = res;
                        // console.log(this.compras);
                        let saldo = 0;
                        // tslint:disable-next-line: forin
                        for (const key in this.compras){
                          // tslint:disable-next-line: radix
                          saldo = parseInt(this.compras[key].compra[3]) + saldo;
                        }
                        this.subtotal = saldo;
                        this.liquidacion = saldo;
                        this.descripcion = this.idUser;
                        console.log(this.cifrado);
                      });
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

  borrarProducto(compra){
    Swal.fire({
      title: 'Está seguro?',
      text: `Se eliminará definitivamente este juego del carrito!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then(result => {
      if (result.value) {
        this.productoSvc.deleteItemCarById(compra.id, this.idUser).then(() => {
          Swal.fire('Eliminado!', 'El producto ha sido borrado.', 'success');
        }).catch((error) => {
          Swal.fire('Error!', 'Error al eliminar el producto', 'error');
        });
      }
    });
  }

  payu(){
    this.reference = Math.ceil(Math.random() * 987524);
    const signature = Md5.init(`${this.apiKey}~${this.merchantid}~${this.reference}~${this.liquidacion}~COP`);
    const pasarela = `
    <img src="../../../assets/img/logo_payu.png" alt="" width="90">
    <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
      <input name="merchantId" type="hidden" value="${this.merchantid}">
      <input name="accountId" type="hidden" value="${this.accountId}">
      <input name="description" type="hidden" value="Pago PAYU EjePlay Pereira">
      <input name="referenceCode" type="hidden" value="${this.reference}">
      <input name="amount" type="hidden" value="${this.liquidacion}">
      <input name="tax" type="hidden" value="0">
      <input name="taxReturnBase" type="hidden" value="0">
      <input name="currency" type="hidden" value="COP">
      <input name="signature" type="hidden" value="${signature}">
      <input name="test" type="hidden" value="1">
      <input name="buyerEmail" type="hidden" value="${this.email}">
      <input name="responseUrl" type="hidden" value="http://localhost:4200/confirmacion">
      <input name="confirmationUrl" type="hidden" value="http://www.test.com/confirmation">
      <button type="submit" class="pago">
          <i class="fa fa-credit-card" aria-hidden="true"> Aceptar </i>
      </button>
    </form>`;
    const fecha = new Date().getTime();
    const medio = 'PayU';
    const estado = 'Procesandose';
    const refer = this.reference.toString();
    this.productoSvc.sailProcesss(refer, this.idUser, this.liquidacion,
                                  fecha, medio, estado).then(res => {
      Swal.fire({
        title: 'Realizar pago',
        icon: 'info',
        html: pasarela,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: '#d33',
      });
    }).catch(err => {
      Swal.fire({
        title: 'Error...',
        text: 'Algo salió mal!!!',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
    });
  }

}
