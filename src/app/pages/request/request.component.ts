import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Md5 } from 'md5-typescript';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  checkOn = false;
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

  constructor(private productoSvc: ProductsService,
              private authSvc: AuthService,
              public http: HttpClient) { }

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
      this.productoSvc.cargarCompras(this.idUser)
                      .subscribe(res => {
                        this.compras = res;
                        let saldo = 0;
                        let desc = 0;
                        // tslint:disable-next-line: forin
                        for (const key in this.compras){
                          // tslint:disable-next-line: radix
                          saldo = parseInt(this.compras[key].compra[3]) + saldo;
                          // tslint:disable-next-line: radix
                          desc =  ((parseInt(this.compras[key].compra[3]) * parseInt (this.compras[key].compra[4])) / 100) + desc;
                        }
                        this.subtotal = saldo;
                        this.liquidacion = saldo - desc;
                        this.descripcion = this.idUser;
                        this.descuento = desc;
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
                      });
    } else {
      this.dolar = false;
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
    if (this.checkOn) {
      this.reference = Math.ceil(Math.random() * 987524);
      this.signature = Md5.init(`${this.apiKey}~${this.merchantid}~${this.reference}~${this.liquidacion}~COP`);
      const fecha = new Date().getTime();
      const medio = 'PayU';
      const estado = 'Procesandose';
      const refer = this.reference.toString();
      this.productoSvc.sailProcesss(refer, this.idUser, this.liquidacion, fecha, medio, estado)
                    .then(res => {
                     this.productoSvc.cargarCompras(this.idUser)
                         .subscribe(list => {
                           this.carList = list;
                            // tslint:disable-next-line: prefer-for-of
                           for (let i = 0; i < this.carList.length; i++) {
                              const item = this.carList[i];
                              this.productoSvc.saleProcessReference(item.id, refer);
                            }
                         });
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
}
