import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Producto } from 'src/app/shared/producto.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  private image: any;
  imageSrc: any;
  producto: Producto;

  constructor(private productoSvc: ProductsService,
              private route: ActivatedRoute,
              private router: Router) { }

  get nombreNoValido() {
    return this.newProductForm.get('nombre').invalid && this.newProductForm.get('nombre').touched;
  }
  get precioNoValido() {
    return this.newProductForm.get('precio').invalid && this.newProductForm.get('precio').touched;
  }
  get preciosecNoValido() {
    return this.newProductForm.get('preciosec').invalid && this.newProductForm.get('preciosec').touched;
  }
  get imageNoValido() {
    return this.newProductForm.get('imageProd').invalid && this.newProductForm.get('imageProd').touched;
  }
  get pesoNoValido() {
    return this.newProductForm.get('peso').invalid && this.newProductForm.get('peso').touched;
  }
  get descripcionNoValido() {
    return this.newProductForm.get('descripcion').invalid && this.newProductForm.get('descripcion').touched;
  }
  get cantPpalNoValido() {
    return this.newProductForm.get('cantPpal').invalid && this.newProductForm.get('cantPpal').touched;
  }
  get cantSecNoValido() {
    return this.newProductForm.get('cantSec').invalid && this.newProductForm.get('cantSec').touched;
  }

  newProductForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    tipo: new FormControl('Ps4', Validators.required),
    precio: new FormControl('', Validators.required),
    cantPpal: new FormControl('0', Validators.required),
    preciosec: new FormControl('', Validators.required),
    cantSec: new FormControl('0', Validators.required),
    categoria: new FormControl('Accion', Validators.required),
    peso: new FormControl('', Validators.required),
    idioma: new FormControl('Multi Idioma', Validators.required),
    oferta: new FormControl('0', Validators.required),
    fechaCreacion: new FormControl(new Date().getTime()),
    imageProd: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required )
  });

  ngOnInit(): void {}

  addNewProduct(product: Producto){
    // console.log(product);
    if ( this.newProductForm.invalid ) {
      Swal.fire({
        title: 'Error...',
        text: 'Debe ingresar la información requerida',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
      return Object.values( this.newProductForm.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    Swal.fire({
      title: product.nombre,
      text: 'Creado satisfactoriamente',
      icon: 'success',
      showCloseButton: true
    });
    this.productoSvc.filterProd(product, this.image);
    this.router.navigate(['/administrador']);
  }

  handleImage(event: any){
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

}
