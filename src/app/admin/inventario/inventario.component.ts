import { Component, OnInit } from '@angular/core';
import { Producto } from '../../shared/producto.interface';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  juegos: any;
  filterProducto = '';

  constructor(public productoSvc: ProductsService) { }

  ngOnInit(): void {
    this.productoSvc.cargarProductos()
                    .subscribe (resp => {
                      this.juegos = resp;
                      console.log(this.juegos);
                    });
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
