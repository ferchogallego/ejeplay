import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/shared/producto.interface';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {

  producto: Producto;
  imageSrc: any;
  image: any;
  private imageOriginal: any;
  imgLoad = false;

  constructor(private productoSvc: ProductsService,
              private route: ActivatedRoute,
              private router: Router) { }

    editProductForm = new FormGroup({
      id: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      tipo: new FormControl('Ps4', Validators.required),
      precio: new FormControl('', Validators.required),
      cantPpal: new FormControl('0', Validators.required),
      preciosec: new FormControl('', Validators.required),
      cantSec: new FormControl('0', Validators.required),
      categoria: new FormControl('', Validators.required),
      peso: new FormControl('', Validators.required),
      idioma: new FormControl('', Validators.required),
      oferta: new FormControl('', Validators.required),
      fechaCreacion: new FormControl(new Date().getTime()),
      imageProd: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });

  get nombreNoValido() {
    return this.editProductForm.get('nombre').invalid && this.editProductForm.get('nombre').touched;
  }
  get precioNoValido() {
    return this.editProductForm.get('precio').invalid && this.editProductForm.get('precio').touched;
  }
  get preciosecNoValido() {
    return this.editProductForm.get('preciosec').invalid && this.editProductForm.get('preciosec').touched;
  }
  get imageNoValido() {
    return this.editProductForm.get('imageProd').invalid && this.editProductForm.get('imageProd').touched;
  }
  get pesoNoValido() {
    return this.editProductForm.get('peso').invalid && this.editProductForm.get('peso').touched;
  }
  get descripcionNoValido() {
    return this.editProductForm.get('descripcion').invalid && this.editProductForm.get('descripcion').touched;
  }
  get cantPpalNoValido() {
    return this.editProductForm.get('cantPpal').invalid && this.editProductForm.get('cantPpal').touched;
  }
  get cantSecNoValido() {
    return this.editProductForm.get('cantSec').invalid && this.editProductForm.get('cantSec').touched;
  }

  private initValuesForm(){
    this.editProductForm.patchValue({
      id: this.producto.id,
      nombre: this.producto.nombre,
      tipo: this.producto.tipo,
      oferta: this.producto.oferta,
      precio: this.producto.precio,
      cantPpal: this.producto.cantPpal,
      preciosec: this.producto.preciosec,
      cantSec: this.producto.cantSec,
      categoria: this.producto.categoria,
      peso: this.producto.peso,
      idioma: this.producto.idioma,
      fechaCreacion: this.producto.fechaCreacion,
      descripcion: this.producto.descripcion,
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productoSvc.getProductById(id)
                    .subscribe((resp: Producto) => {
                      this.producto = resp;
                      this.producto.id = id;
                      this.image = this.producto.imageProd;
                      this.imageOriginal = this.producto.imageProd;
                      console.log('Producto: ', this.producto.descripcion);
                      this.initValuesForm();
                    });
  }

  editProduct(prd: Producto){
    Swal.fire({
      title: 'Actualización de producto',
      text: `Actualizando datos del producto`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar'
    }).then(result => {
      if (result.value) {
        if (this.image === this.imageOriginal) {
          prd.imageProd = this.imageOriginal;
          this.productoSvc.updateProductById(prd).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        } else {
          this.productoSvc.updateProductById(prd, this.image).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        }
      }
    });
    this.router.navigate(['/administrador']);
  }

  handleImage(event: any){
    this.imgLoad = true;
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

}
