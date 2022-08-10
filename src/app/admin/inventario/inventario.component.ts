import { Component, OnInit } from '@angular/core';
import { Producto } from '../../shared/producto.interface';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';
import { Productps5Service } from 'src/app/services/productps5.service';
import { FisicosService } from 'src/app/services/fisicos.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  juegos: any;
  ps4: any;
  ps5: any;
  fisicos: any;
  filterProducto = '';

  constructor(public productoSvc: ProductsService,
              public ps5Svc: Productps5Service,
              public fisicoSvc: FisicosService) { }

  ngOnInit(): void {
    this.productoSvc.tipo = 'Ps4';
    this.productoSvc.cargarProductosOrdenFecha()
                    .subscribe (resp => {
                      this.juegos = resp;
                      this.ps4 = resp;
                    });
  }

  cargarPs5(){
    this.juegos = [];
    if (!this.ps5) {
      this.ps5Svc.cargarProductosOrdenFecha()
      .subscribe (resp => {
        this.juegos = resp;
      });
    } else {
      this.juegos = this.ps5;
    }

    this.productoSvc.tipo = 'ps5';
  }

  cargarPs4(){
    this.juegos = [];
    this.juegos = this.ps4;
    this.productoSvc.tipo = 'ps4';
  }

  cargarFisicos(){
    this.juegos = [];
    if (!this.fisicos) {
      this.fisicoSvc.cargarProductosOrdenFecha()
      .subscribe (resp => {
        this.juegos = resp;
      });
    } else {
      this.juegos = this.fisicos;
    }
    this.productoSvc.tipo = 'fisicos';
  }

  

  borrarProducto(producto: Producto){
    Swal.fire({
      title: 'Está seguro?',
      text: `Se eliminará definitivamente este producto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then(result => {
      if (result.value) {
        this.productoSvc.deletePostById(producto).then(() => {
          Swal.fire('Eliminado!', 'El producto ha sido borrado.', 'success');
        }).catch((error) => {
          Swal.fire('Error!', 'Error al eliminar el producto', 'error');
        });
      }
    });
  }

}
