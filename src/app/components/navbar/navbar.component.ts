import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() selectCurrency = new EventEmitter();

  pago: string;
  dolar = false;
  valor: string;
  buscador: boolean;
  public user$: Observable<any> = this.authSvc.afAuth.user;
  public user = this.authSvc.afAuth.user;
  perfilUser: any;
  idUser: string;
  compras: any;
  pedidos: any;
  cantCompras: number;
  compra = [];

  catalogo = false;

  searchForm = new FormGroup ({
    palabra: new FormControl('')
  });

  constructor(private authSvc: AuthService,
              private router: Router,
              private productoSvc: ProductsService) {
    this.loadStorage();
  }

  ngOnInit(): void {
    if (this.productoSvc.catalogo === true) {
      this.catalogo = true;
    }
    this.buscador = this.productoSvc.search;
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      if (this.perfilUser) {
        this.idUser = this.perfilUser.uid;
        this.productoSvc.purchasesByBuyer(this.perfilUser.uid)
                        .subscribe(res => {
                          this.cantCompras = res.length;
                        });
      } else {
        localStorage.setItem('carShoEjePlay', JSON.stringify(this.compra));
      }
    });
    if (this.productoSvc.divisa === 'USD') {
      this.dolar = true;
      this.valor = this.productoSvc.divisa;
    } else {
      this.dolar = false;
      this.valor = this.productoSvc.divisa;
    }
  }

  onLogout(){
    Swal.fire({
      title: 'Salir de Eje Play?',
      text: 'Vas a cerrar tu sesión, lo que tengas en el carrito se eliminará?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar'
    }).then((result) => {
      if (result.value) {
        try {
          this.limpiarCarrito();
          this.authSvc.logout();
          this.router.navigate(['/home']);
        } catch (error) {
          console.log(error);
        }
        Swal.fire(
          'Sesión finalizada!',
          'Te esperamos de nuevo.',
          'success'
        );
      }
    });
   }

   limpiarCarrito(){
    localStorage.setItem('carShoEjePlay', JSON.stringify(this.compra));
    this.router.navigate(['/solicitudes']);
   }

   onDivisa(event: string){
     this.pago = event;
     Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a cambiar la moneda de pago a' + ' ' + this.pago,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectCurrency.emit(this.pago);
        if (this.pago === 'USD') {
          this.dolar = true;
        } else {
          this.dolar = false;
        }
        Swal.fire(
          'Hecho!',
          'La moneda de pago ha sido modificada.',
          'success'
        );
      }
    });
   }

   OnSearch(word: string){
    // console.log(word);
    this.productoSvc.termino = word;
    if (word) {
      this.router.navigate(['/catalogo']);
    }
   }

   openCatalogInOffer(){
    this.productoSvc.fisicos = false;
    this.productoSvc.ofertas = true;
    this.router.navigate(['/catalogo']);
   }

   openCatalogoAll(){
    this.productoSvc.fisicos = false;
    this.productoSvc.ofertas = false;
    this.router.navigate(['/catalogo']);
   }

   loadStorage(){
    if (localStorage.getItem('carShoEjePlay')) {
      this.compras = JSON.parse( localStorage.getItem('carShoEjePlay'));
      this.pedidos = this.compras.length;
    }
  }
  }
