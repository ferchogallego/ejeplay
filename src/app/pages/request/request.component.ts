import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Md5 } from 'md5-typescript';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { auth } from 'firebase';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  cupon = true;
  checkOn = true;
  cont = 0;

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
  liquidacion1 = 140000;
  descuento: number;
  descripcion: string;
  apiKey = 'uo855KDPGSSnTX2UJd79KrXCAG';
  merchantid = '851420';
  accountId = '858956';
  cifrado: string;
  moneda: 'COP';
  reference: number;
  signature: any;
  canc: any;
  carRef: any;
  carList: any;
  compra: any = {
    cliente: '',
    email: '',
    carrito: [],
    fecha: new Date().getTime(),
    refCompra: '',
    estado: 'Pendiente',
  };
  dataUser: any;
  codcup: string;
  cuponIni = false;
  cuponGeneral: any;
  descuentoCupon = 0;
  nomProds = '';
  descuentoCp: number;
  liquidacionCp: number;
  desCpon = 0;

  dias: number;

  constructor(private productoSvc: ProductsService,
              private authSvc: AuthService,
              private router: Router,
              public http: HttpClient) {
    this.loadStorage();
 }

  ngOnInit(): void {
    this.productoSvc.termino = '';
    this.productoSvc.catalogo = false;
    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.idUser = this.perfilUser.uid;
      this.email =  this.perfilUser.email;
      // this.verificarDiasRegistro();
    });
    this.calcularCosto();
  }

 /* verificaCuponUsuario(){
    this.authSvc.verificarCuponesUsuarios(this.idUser)
                .subscribe(res => {
                  this.dataUser = res;
                  // console.log(this.dataUser);
                  if (this.dataUser.cuponInicio === 'No') {
                    const actual = new Date().getTime();
                    const milisegundos = 24 * 60 * 60 * 1000;
                    const milisegundosTranscurridos = Math.abs(this.dataUser.fecha - actual);
                    const dias = Math.round(milisegundosTranscurridos / milisegundos);
                    if (dias < 4) {
                      this.cuponIni = true;
                      Swal.fire(
                        'Hace poco te registraste',
                        'Tienes disponible el cupón de bienvenida',
                        'success'
                      );
                    }
                  }
                });
  } */

  calcularCosto(){
    let saldo = 0;
    let desc = 0;
    // tslint:disable-next-line: forin
    for (const key in this.compras){
      // tslint:disable-next-line: radix
      saldo = parseInt(this.compras[key].precio) + saldo;
      // tslint:disable-next-line: radix
      desc =  ((parseInt(this.compras[key].precio) * parseInt (this.compras[key].descuento)) / 100) + desc;
    }
    this.subtotal = saldo;
    this.liquidacion = saldo - desc;
    this.descripcion = this.idUser;
    this.descuento = desc;
    if (this.liquidacion === 0) {
      Swal.fire(
        'Tu carrito de compras esta vacío',
        'Selecciona del catálogo los productos que necesitas',
        'success'
      );
      this.router.navigate(['catalogo']);
    }
  }

  /* verificarDiasRegistro(){
    this.authSvc.verificarCuponesUsuarios(this.idUser)
    .subscribe(res => {
      this.dataUser = res;
      if (this.dataUser.cuponInicio === 'No') {
        this.cuponIni = true;
        this.descuentoCp = (this.liquidacion * 10) / 100;
        this.liquidacionCp = this.liquidacion - ((this.liquidacion * 10) / 100);
      } else {
        this.cuponIni = false;
      }
    });
  }
 */
 /*  cuponRegistro(){
    if (!this.cuponIni) {
      Swal.fire(
        'Cupón canjeado',
        'Cupón de bienvenida ya fué redimido.',
        'success'
      );
    }
    if (this.cuponIni) {
      this.liquidacion = this.liquidacionCp;
      this.descuento = this.descuentoCp;
      this.authSvc.usarCuponRegistro(this.idUser);
    }

  }
 */
  cuponFiel(){
    Swal.fire(
      'Sigue comprando',
      'No tienes las ventas suficientes para canjear este cupón del 50% de descuento.',
      'success'
    );
  }

  loadStorage(){
    if (localStorage.getItem('carShoEjePlay')) {
      this.compras = JSON.parse( localStorage.getItem('carShoEjePlay'));
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
                      });
    } else {
      this.dolar = false;
    }
  }

  borrarProducto(item: number){
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
        this.compras.splice(item, 1);
        this.calcularCosto();
        this.productoSvc.updateStorage(this.compras);
        Swal.fire('Eliminado!', 'El producto ha sido borrado.', 'success');
      }
    });
  }

  payu(){
    if (this.checkOn) {
      this.nomProds = '';
      // tslint:disable-next-line: forin
      for (const key in this.compras){
      // tslint:disable-next-line: radix
      this.nomProds = this.nomProds + ' ' + ' ' + this.compras[key].nombre;
    }

      this.reference = Math.ceil(Math.random() * 987524);
      this.signature = Md5.init(`${this.apiKey}~${this.merchantid}~${this.reference}~${this.liquidacion}~COP`);
      const fecha = new Date().getTime();
      const medio = 'PayU';
      const estado = 'Procesandose';
      const refer = this.reference.toString();
      this.compra.cliente = this.idUser;
      this.compra.email = this.email;
      this.compra.carrito = this.compras;
      this.compra.refCompra = refer;
      // console.log(this.compra);
      this.productoSvc.sailFinalProccess(this.compra);
      const pasarela = `
      <img src="../../../assets/img/logo_payu.png" alt="" width="90">
      <form method="post" action="https://checkout.payulatam.com/ppp-web-gateway-payu/">
      <input name="merchantId" type="hidden" value="${this.merchantid}">
      <input name="accountId" type="hidden" value="${this.accountId}">
      <input name="description" type="hidden" value="${this.nomProds}">
      <input name="referenceCode" type="hidden" value="${this.reference}">
      <input name="amount" type="hidden" value="${this.liquidacion}">
      <input name="tax" type="hidden" value="0">
      <input name="taxReturnBase" type="hidden" value="0">
      <input name="currency" type="hidden" value="COP">
      <input name="signature" type="hidden" value="${this.signature}">
      <input name="test" type="hidden" value="0">
      <input name="buyerEmail" type="hidden" value="${this.email}">
      <input name="responseUrl" type="hidden" value="https://www.ejeplaypereira.com/#/confirmacion">
      <input name="confirmationUrl" type="hidden" value="http://www.test.com/confirmation">
        <button type="submit" class="pago" (click)="ventaGenerada()">
            <i class="fa fa-credit-card" aria-hidden="true"> Aceptar </i>
        </button>
      </form>`;
      Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          html: pasarela,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d33'
        });
    }  else {
      Swal.fire({
        title: 'Error...',
        text: 'Debes aceptar términos y condiciones para la compra',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
        });
    }
  }
  ventaGenerada(){
    this.productoSvc.sailFinalProccess(this.compra);
  }
  saleCancel(referencia){
    const rfr = referencia.toString();
    this.productoSvc.cancelSaleProcess(rfr)
        .subscribe(res => {
          this.canc = res;
          // console.log(this.canc[0].id);
          this.productoSvc.deleteSaleCancel(this.canc[0].id);
          location.reload();
        });
  }

check(event: any){
    if (this.cont === 0) {
      this.cont++;
      this.checkOn = true;
    } else if (this.cont > 0) {
      this.cont--;
      this.checkOn = false;
    }
}

codCupon(cod: string){
  this.codcup = cod;
}

canjearCuponGeneral(){
  if (this.cupon) {
    this.productoSvc.consultaCuponAdmin(this.codcup)
                  .subscribe(res => {
                    console.log();
                    this.cuponGeneral = res;
                    if (res.length === 0) {
                      Swal.fire(
                        'Error',
                        'Este código de cupón no es válido',
                        'error'
                      );
                      return;
                    } else {
                      this.descuentoCupon = this.cuponGeneral[0].descuento;
                      this.desCpon = this.descuentoCupon;
                      this.liquidacion = this.liquidacion - ((this.liquidacion * this.descuentoCupon) / 100);
                      this.cupon = false;
                      Swal.fire(
                        'Canjeado',
                        'Se ha aplicado el descuento',
                        'success'
                      );
                    }
                  });
  }
  if (!this.cupon) {
    Swal.fire(
      'Canjeado',
      'Ya aplicaste un cupón a esta compra',
      'error'
    );
  }
}

}
