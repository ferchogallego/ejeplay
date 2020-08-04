import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  prim = false;
  secund = false;
  activa = false;

  load = false;
  dolar = false;
  precioDolar: any;
  usd: number;
  game: any;
  idGame: string;
  juego: string;
  imagen: string;
  idioma: string;
  peso: string;
  precio: string;
  preciosec: string;
  oferta: number;
  categoria: string;
  descripcion: string;
  tipo: string;
  cantP: number;
  cantS: number;
  relacionados: any;

  public user = this.authSvc.afAuth.user;
  perfilUser: any;

  solicitud: any = {
    compra: [],
    estado: 'Pendiente',
    fecha: new Date().getTime(),
    usuario: '',
  };

  descrip = true;
  ficha = false;
  comentarios = false;

  constructor(private productoSvc: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private authSvc: AuthService) { }

  ngOnInit(): void {
    this.productoSvc.search = true;
    const id = this.route.snapshot.paramMap.get('id');
    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.productoSvc.loadGameById(id)
                    .subscribe(res => {
                      // console.log(res);
                      this.game = res;
                      this.idGame = this.game.id;
                      this.juego = this.game.nombre;
                      this.imagen = this.game.imageProd ;
                      this.idioma = this.game.idioma;
                      this.peso = this.game.peso;
                      this.precio = this.game.precio;
                      this.preciosec = this.game.preciosec;
                      this.oferta = this.game.oferta;
                      this.categoria = this.game.categoria;
                      this.descripcion = this.game.descripcion;
                      this.tipo = this.game.tipo;
                      this.cantP = this.game.cantPpal;
                      this.cantS = this.game.cantSec;
                      this.productoSvc.loadGamesByCategory(this.categoria)
                                      .subscribe(cat => {
                                        this.relacionados = cat;
                                        // console.log(this.relacionados);
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
  openGame(juego: string){
    this.game = '';
    this.productoSvc.loadGameById(juego)
                    .subscribe(res => {
                      console.log(res);
                      this.game = res;
                      this.juego = this.game.nombre;
                      this.imagen = this.game.imageProd ;
                      this.idioma = this.game.idioma;
                      this.peso = this.game.peso;
                      this.precio = this.game.precio;
                      this.preciosec = this.game.preciosec;
                      this.oferta = this.game.oferta;
                      this.categoria = this.game.categoria;
                      this.descripcion = this.game.descripcion;
                      this.tipo = this.game.tipo;
                      this.productoSvc.loadGamesByCategory(this.categoria)
                                      .subscribe(cat => {
                                        this.relacionados = cat;
                                        // console.log(this.relacionados);
                                      });
                    });
  }

  request(idGame: string){
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.solicitud.idJuego = idGame;
      this.solicitud.usuario = this.perfilUser.uid;
      console.log(this.solicitud);
      this.productoSvc.cargarPedido(this.solicitud);
    });
    this.router.navigate(['/solicitudes']);
  }
  viewTabs(contenido: string){
   if (contenido === 'descripcion') {
    this.descrip = true;
    this.ficha = false;
    this.comentarios = false;
   }
   if (contenido === 'ficha') {
    this.descrip = false;
    this.ficha = true;
    this.comentarios = false;
   }
   if (contenido === 'comentarios') {
    this.descrip = false;
    this.ficha = false;
    this.comentarios = true;
   }
  }
  activateSale(slot: string){
    if (slot === 'primario') {
      if (this.cantP > 0) {
        this.prim = true;
        this.secund = false;
        this.activa = true;
        const primaria = 'Primaria';
        this.solicitud.compra = [];
        this.solicitud.compra.push(this.idGame, this.juego, this.imagen, this.precio, primaria);
      }
      if (this.cantP === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'No contamos con inventario, pronto tendremos este título',
        });
      }
    }
    if (slot === 'secundario') {
      if (this.cantS > 0) {
        this.prim = false;
        this.secund = true;
        this.activa = true;
        const secundaria = 'Secundaria';
        this.solicitud.compra = [];
        this.solicitud.compra.push(this.idGame, this.juego, this.imagen, this.preciosec, secundaria);
      }
      if (this.cantS === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'No contamos con inventario, pronto tendremos este título',
        });
      }
    }
  }
}
