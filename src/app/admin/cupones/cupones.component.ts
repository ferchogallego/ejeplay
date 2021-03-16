import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss']
})
export class CuponesComponent implements OnInit {
  nombreC: string;
  codigoC: string;
  descuentoC: number;
  duracionC: number;
  coupons: any;
  cuponData = {};
  constructor(private prodSvc: ProductsService) { }

  ngOnInit(): void {
    this.prodSvc.cargarCupones()
                .subscribe(res => {
                  this.coupons = res;
                });
  }

  nombreCupon(nombre: string){
    this.nombreC = nombre;
  }

  codigoCupon(codigo: string){
    this.codigoC = codigo;
  }

  descuentoCupon(descuento: number){
    this.descuentoC = descuento;
  }

  duracionCupon(duracion: number){
    this.duracionC = duracion;
  }

  generaCupon(){
    if (this.nombreC === undefined || this.codigoC === undefined || this.descuentoC === undefined || this.duracionC === undefined
    || this.nombreC === '' || this.codigoC === '' || this.descuentoC < 1 || this.descuentoC < 1) {
      Swal.fire(
        'Faltan datos o datos incorrectos',
        'Debe ingresar los datos, el valor del descuento y la duración deben ser mayor que cero ',
        'error'
      );
    } else {
      this.cuponData = {
        fecha: new Date().getTime(),
        nombre: this.nombreC,
        codigo: this.codigoC,
        descuento: Number(this.descuentoC),
        duracion: this.duracionC,
        activo: 'Si'
      };
      this.prodSvc.generarCuponAdmin(this.cuponData);
    }
  }

  eliminaCupon(id){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a eliminar este cupón',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodSvc.elimimarCuponPorId(id);
        Swal.fire(
          'Borrado!',
          'Cupó eliminado.',
          'success'
        );
      }
    });
  }

}
