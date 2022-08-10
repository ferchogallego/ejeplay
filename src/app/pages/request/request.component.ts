import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Md5 } from 'md5-typescript';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    entrega: []
  };
  datosPayu = {
    merchantid: '',
    accountId: '',
    nomProds: '',
    reference: 0,
    liquidacion: 0,
    signature: '',
    email: ''
  }
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
  confirmado = false;
  ciudadesList: any;
  citySelection: any;
  city: string;

  fisicos = false;

  delivery: any;

  deliveryForm = new FormGroup ({
    nombre: new FormControl('', Validators.required),
    tipodocumento: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.minLength(7)]),
    departamento: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required)
  });

  get nombreNoValido() {
    return this.deliveryForm.get('nombre').invalid && this.deliveryForm.get('nombre').touched;
  }
  get tipodocumentoNoValido() {
    return this.deliveryForm.get('tipodocumento').invalid && this.deliveryForm.get('tipodocumento').touched;
  }
  get numeroNoValido() {
    return this.deliveryForm.get('numero').invalid && this.deliveryForm.get('numero').touched;
  }
  get telefonoNoValido() {
    return this.deliveryForm.get('telefono').invalid && this.deliveryForm.get('telefono').touched;
  }
  get departamentoNoValido() {
    return this.deliveryForm.get('departamento').invalid && this.deliveryForm.get('departamento').touched;
  }
  get ciudadNoValido() {
    return this.deliveryForm.get('ciudad').invalid && this.deliveryForm.get('ciudad').touched;
  }
  get direccionNoValido() {
    return this.deliveryForm.get('direccion').invalid && this.deliveryForm.get('direccion').touched;
  }

  usuario: any;

  constructor(private productoSvc: ProductsService,
              private authSvc: AuthService,
              private router: Router,
              public http: HttpClient) {
    this.loadStorage();
 }

  ngOnInit(): void {
    this.ciudadesList = this.productoSvc.departamentosList;
    console.log(this.ciudadesList);
    
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
    this.loadLocalStorage();
  }

  loadLocalStorage(){
    if (localStorage.getItem('dataUserEjeplay')) {
      this.usuario = JSON.parse( localStorage.getItem('dataUserEjeplay')!);
      console.log(this.usuario);      
    }
  }

  seleccionaDepartamento(departamento: string){
    for (const key in this.ciudadesList){
      if (this.ciudadesList[key].nombre === departamento) {
        this.citySelection = this.ciudadesList[key].ciudades;
      }
    }
  }

  seleccionaCiudad(ciudad: string){
    this.city = ciudad;
  }

  infoUser(info: any){
    if (this.deliveryForm.invalid) {
      Swal.fire('Por favor completar todos los datos y dar click en botón Confirmar datos para que pueda completar su compra.');
      return;
    }
    if (this.subtotal >= 20000) {
      this.confirmado = true;
      this.delivery = info;
      /* this.authSvc.updateInfoUser(this.idUser, info)
                  .then(userInfo => {
                    Swal.fire('Actualizado!', 'Se han confirmado los datos de entrega.', 'success');
                  }); */
    } else {
      Swal.fire('El pedido mínimo debe ser de $20.000');
      return;
    }
  }

  datosCliente(datosEntrega: any){
        
  }


  calcularCosto(){
    let contFisicos = 0;
    let saldo = 0;
    let desc = 0;
    for (const key in this.compras){
      saldo = parseInt(this.compras[key].precio) + saldo;
      desc =  ((parseInt(this.compras[key].precio) * parseInt (this.compras[key].descuento)) / 100) + desc;
      if (this.compras[key].tipo === 'fisicos') {
        this.fisicos = true;
        contFisicos++;
      }
    }
    if (contFisicos === 0) {
      this.fisicos = false;
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
  
  cuponRegistro(){  
    this.cuponIni = true;  
    this.desCpon = 10;
    this.liquidacion = this.liquidacion - ((this.liquidacion * this.desCpon) / 100);
    this.usuario.cuponInicio = 'No';
  }
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
      if (this.fisicos) {
        if (!this.delivery) {
          Swal.fire('Por favor ingrese los datos para el envío del producto y de click en confirmar datos');
          return;
        }
        this.compra.entrega = this.delivery;
      }
      if (this.cuponIni) {
        this.usuario.cuponInicio = 'No';
        localStorage.setItem('dataUserEjeplay', JSON.stringify(this.usuario));
        this.authSvc.updateCuponRegisterUser(this.usuario.id);
      }
      this.nomProds = '';
      for (const key in this.compras){
      this.nomProds = this.nomProds + ' ' + ' ' + this.compras[key].nombre;

      this.reference = Math.ceil(Math.random() * 987524);
      this.signature = Md5.init(`${this.apiKey}~${this.merchantid}~${this.reference}~${this.liquidacion}~COP`);
      const refer = this.reference.toString();
      this.compra.cliente = this.idUser;
      this.compra.email = this.email;
      this.compra.carrito = this.compras;
      this.compra.refCompra = refer;
     
      this.datosPayu.merchantid = this.merchantid;
      this.datosPayu.accountId = this.accountId;
      this.datosPayu.nomProds = this.nomProds;
      this.datosPayu.reference = this.reference;
      this.datosPayu.liquidacion = this.liquidacion;
      this.datosPayu.signature = this.signature;
      this.datosPayu.email = this.email;

      this.productoSvc.dataPayu = this.datosPayu;
      this.productoSvc.datosCompra = this.compra;
      this.router.navigate(['/finalizar']);
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