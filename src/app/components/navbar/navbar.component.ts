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
  pedidos: any;

  catalogo = false;

  searchForm = new FormGroup ({
    palabra: new FormControl('')
  });

  constructor(private authSvc: AuthService,
              private router: Router,
              private productoSvc: ProductsService) { }

  ngOnInit(): void {
    if (this.productoSvc.catalogo === true) {
      this.catalogo = true;
    }
    this.buscador = this.productoSvc.search;
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.idUser = this.perfilUser.uid;
      this.productoSvc.cantPedidos(this.perfilUser.uid)
                      .subscribe (cant => {
                        this.pedidos = cant.length;
                      });
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
      text: 'Vas a cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar'
    }).then((result) => {
      if (result.value) {
        try {
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

   onDivisa(event: string){
     this.pago = event;
     this.selectCurrency.emit(this.pago);
     if (this.pago === 'USD') {
       this.dolar = true;
     } else {
       this.dolar = false;
     }
     console.log('navbar:', this.dolar);
   }

   OnSearch(word: string){
    // console.log(word);
    this.productoSvc.termino = word;
    if (word) {
      this.router.navigate(['/catalogo']);
    }
   }

   openCatalogInOffer(){
     this.productoSvc.ofertas = true;
     this.router.navigate(['/catalogo']);
   }

   openCatalogoAll(){
    this.productoSvc.ofertas = false;
    this.router.navigate(['/catalogo']);
   }
  }
