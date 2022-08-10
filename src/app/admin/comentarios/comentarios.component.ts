import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {
  lista: any;
  constructor(private prodSvc: ProductsService) { }

  ngOnInit(): void {
    this.prodSvc.cargarComentarionRevision()
                .subscribe(res => {
                  this.lista = res;
                });
  }

  aceptarComentario(idComent){
    Swal.fire({
      title: 'Está Seguro',
      text: 'Se va a aceptar este comentario',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodSvc.aceptarComentario(idComent);
        Swal.fire(
          'Activo!',
          'Comentario Publicado',
          'success'
        );
      }
    });
  }

  eliminarComentario(idComent){
    Swal.fire({
      title: 'Está Seguro',
      text: 'Se va a eliminar este comentario',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodSvc.borrarComentario(idComent);
        Swal.fire(
          'Eliminado!',
          'Comentario borrado',
          'success'
        );
      }
    });
  }

}
