import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { PruebaService } from 'src/app/services/prueba.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detallefisicos',
  templateUrl: './detallefisicos.component.html',
  styleUrls: ['./detallefisicos.component.scss']
})
export class DetallefisicosComponent implements OnInit {

  usuario: any;
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
  imagen1: string;
  imagen2: string;
  imagen3: string;
  miniatura: string;
  miniatura1: string;
  miniatura2: string;
  miniatura4: string;

  idioma: string;
  peso: string;
  precio: any;
  preciosec: any;
  oferta: number;
  categoria: string;
  descripcion: string;
  tipo: string;
  cantP: number;
  cantS: number;
  relacionados: any;
  descuento: number;
  costopri: any;
  costosec: any;
  agotado = false;
  comentador: string;

  datos: {};

  public user = this.authSvc.afAuth.user;
  perfilUser: any;

  solicitud: any = {
   idJuego: '',
   nombre: '',
   imagen: '',
   precio: 0,
   descuento: 0,
   cuenta: '',
   tipo: ''
  };

  favoritos: any = {
    juego: '',
    nombre: '',
    usuario: '',
    imagen: '',
    fecha: new Date().getTime()
  };

  compra = [];

  descrip = true;
  ficha = false;
  comentarios = false;
  comentariosList: any;

  juegoFavorito: any;

  constructor(private productoSvc: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private authSvc: AuthService,
              private pruebaSvc: PruebaService) {
    this.loadStorage();
  }

  ngOnInit(): void {
    this.productoSvc.termino = '';
    this.productoSvc.catalogo = false;
    this.productoSvc.search = true;
    const id = this.route.snapshot.paramMap.get('id');

    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.productoSvc.loadGameFisicoById(id)
                    .subscribe(res => {
                      this.game = res;
                      console.log(this.game);
                      this.idGame = id;
                      this.juego = this.game.nombre;
                      this.imagen = this.game.imageProd ;
                      this.idioma = this.game.idioma;
                      this.peso = this.game.peso;
                      this.precio = this.game.precio;
                      this.preciosec = this.game.preciosec;
                      this.oferta = this.game.oferta;
                      this.categoria = this.game.categoria;
                      this.productoSvc.loadGamesByCategory(this.categoria)
                                      .subscribe(cat => {
                                        this.relacionados = cat;
                                      });
                      this.offerCalculate();
                      this.descripcion = this.game.descripcion;
                      this.tipo = this.game.tipo;
                      this.cantP = this.game.cantPpal;
                      this.cantS = this.game.cantSec;
                      this.imagen1 = this.game.images.imagen1;
                      this.imagen2 = this.game.images.imagen2;
                      this.imagen3 = this.game.images.imagen3;
                      this.miniatura = this.game.images.miniatura;
                      this.miniatura1 = this.game.images.miniatura1;
                      this.miniatura2 = this.game.images.miniatura2;
                      this.miniatura4 = this.game.images.miniatura4;
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

  verComentarios(){
    this.productoSvc.cargarComentariosPorIdJuego(this.idGame)
                    .subscribe(cmt => {
                      this.comentariosList = cmt;
                      console.log( this.comentariosList);
                    });
  }

  openGame(juego: string){
    this.game = '';
    this.idGame = juego;
    this.tipo = this.game.tipo;
    this.imagen1 = '';
    this.imagen2 = '';
    this.imagen3 = '';
    this.miniatura = '';
    this.miniatura1 = '';
    this.miniatura2 = '';
    this.miniatura4 = '';
    this.productoSvc.loadGameById(juego)
                    .subscribe(res => {
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
                                      });
                      this.tipo = this.game.tipo;
                      this.cantP = this.game.cantPpal;
                      this.cantS = this.game.cantSec;
                      this.imagen1 = this.game.images.imagen1;
                      this.imagen2 = this.game.images.imagen2;
                      this.imagen3 = this.game.images.imagen3;
                      this.miniatura = this.game.images.miniatura;
                      this.miniatura1 = this.game.images.miniatura1;
                      this.miniatura2 = this.game.images.miniatura2;
                      this.miniatura4 = this.game.images.miniatura4;
                    });
  }

  offerCalculate(){
    if (this.oferta > 0) {
      this.costopri = this.precio - ((this.precio * this.oferta) / 100);
      this.costosec = this.preciosec - ((this.preciosec * this.oferta) / 100);
    }
  }

  request(){
    console.log(this.solicitud);
    this.compra.push(this.solicitud);
    localStorage.setItem('carShoEjePlay', JSON.stringify(this.compra));
    this.router.navigate(['/solicitudes']);
  }

  requestProd(){
    this.solicitud = {
      idJuego: '',
      nombre: '',
      imagen: '',
      precio: 0,
      descuento: 0,
      cuenta: ''
     };
    const primaria = 'N/A';
    this.solicitud.idJuego = this.idGame;
    this.solicitud.nombre = this.juego;
    this.solicitud.imagen = this.imagen;
    this.solicitud.precio = this.precio;
    this.solicitud.descuento = this.oferta;
    this.solicitud.cuenta = primaria;
    this.solicitud.tipo = 'fisicos';
    this.compra.push(this.solicitud);
    localStorage.setItem('carShoEjePlay', JSON.stringify(this.compra));
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
    this.verComentarios();
   }
  }
  activateSale(slot: string, desc: number){
    this.solicitud = {
      idJuego: '',
      nombre: '',
      imagen: '',
      precio: 0,
      descuento: 0,
      cuenta: ''
     };
    this.descuento = desc;
    if (slot === 'primario') {
      if (this.cantP > 0) {
        this.prim = true;
        this.secund = false;
        this.activa = true;
        const primaria = 'Principal';
        this.solicitud.idJuego = this.idGame;
        this.solicitud.nombre = this.juego;
        this.solicitud.imagen = this.imagen;
        this.solicitud.precio = this.precio;
        this.solicitud.descuento = this.descuento;
        this.solicitud.cuenta = primaria;
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
        this.solicitud.idJuego = this.idGame;
        this.solicitud.nombre = this.juego;
        this.solicitud.imagen = this.imagen;
        this.solicitud.precio = this.preciosec;
        this.solicitud.descuento = this.descuento;
        this.solicitud.cuenta = secundaria;
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

  listaDeseos(juego: string, imagen: string){
    this.user.subscribe(usr => {
      this.usuario = usr;
      if (this.usuario !== null) {
        const idUser = this.usuario.uid;
        this.pruebaSvc.confirmarJuegoFavorito(idUser, this.idGame)
                  .then(res => {
                    this.juegoFavorito = res;
                    console.log(this.juegoFavorito.length);
                    if (this.juegoFavorito.length > 0) {
                      Swal.fire(
                        'Ya es favorito!',
                        'El juego ya se encuentra en tu lista de deseos.',
                        'success'
                      );
                      return;
                    } else {
                      this.favoritos = {
                        juego: '',
                        nombre: '',
                        usuario: '',
                        imagen: '',
                        fecha: new Date().getTime()
                      };
                      this.favoritos.juego = this.idGame;
                      this.favoritos.usuario = idUser;
                      this.favoritos.nombre = juego;
                      this.favoritos.imagen = imagen;
                      this.pruebaSvc.agregarListaDeseos(this.favoritos).then(() => {
                            Swal.fire(
                              'Agregado!',
                              'El juego fué agregado a tus favoritos.',
                              'success'
                            );
                          });
                    }
                  });
      } else {
        Swal.fire(
          'Sesión no iniciada!',
          'Para seleccionar favoritos debe iniciar sesión.',
          'question'
        );
      }
    });
  }

  loadStorage(){
    if (localStorage.getItem('carShoEjePlay')) {
      this.compra = JSON.parse( localStorage.getItem('carShoEjePlay'));
    }
  }

  galeria(seleccion: string){
    if (seleccion === '1') {
      this.imagen = this.imagen2;
    }
    if (seleccion === '2') {
      this.imagen = this.imagen3;
    }
    if (seleccion === '3') {
      this.imagen = this.imagen1;
    }
    if (seleccion === '4') {
      this.imagen = this.game.imageProd;
    }
  }

  aliasComentario(alias: string){
    this.comentador = alias;
  }

  comentarioJuego(comentario: string){
    this.datos = {
      coment: comentario,
      fecha: new Date().getTime(),
      estado: 'Revision',
      usuario: this.comentador,
      idJuego: this.idGame
    };
  }

  enviarComentario(){
      Swal.fire({
      title: 'Se va a cargar este comentario',
      text: 'Esta seguro de su comentario del juego?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, comentar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Comentario enviado',
          'Recuerde que el comentario será verificado antes de publicarse.',
          'success'
        );
        this.productoSvc.cargarComentarioJuego(this.datos);
      }
    });
  }
}
