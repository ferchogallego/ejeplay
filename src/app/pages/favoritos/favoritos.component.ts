import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PruebaService } from '../../services/prueba.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  juegos: any;
  usuario: any;
  public user = this.authSvc.afAuth.user;
  load = false;
  constructor(private authSvc: AuthService,
              private pruebaSvc: PruebaService,
              private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.load = true;
    }, 2000);

    this.user.subscribe(usr => {
      this.usuario = usr;
      if (this.usuario !== null) {
        const idUser = this.usuario.uid;
        this.pruebaSvc.cargarFavoritos(idUser)
                  .subscribe(res => {
                    this.juegos = res;
                  });
      }
    });
  }
  openGame(juego: string){
    this.router.navigate([`/detalle/${juego}`]);
  }

  borrarFavorito(idJuego: string){
    this.pruebaSvc.borrarFavorito(idJuego).then(() => {
      Swal.fire(
        'Eliminado',
        'Este juego ya no hace parte de tus favoritos',
        'question'
      );
    });
  }
}
