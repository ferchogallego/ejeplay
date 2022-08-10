import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/shared/producto.interface';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Productps5Service } from 'src/app/services/productps5.service';
import { FisicosService } from 'src/app/services/fisicos.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {

  producto: any;
  imageSrc: any;
  imageSrc1: any;
  image: any;
  private imageOriginal: any;
  imgLoad = false;
  imagenes: any;
  imagen1: any;
  imagen2: string;
  imagen3: string;
  mini: string;
  mini1: string;
  mini2: string;
  mini4: string;

  uploadPercent1: Observable<number>;
  urlImage1: string;
  uploadPercent2: Observable<number>;
  urlImage2: string;
  uploadPercent3: Observable<number>;
  urlImage3: string;
  uploadPercent4: Observable<number>;
  urlmini: string;
  uploadPercent5: Observable<number>;
  urlmini1: string;
  uploadPercent6: Observable<number>;
  urlmini2: string;
  uploadPercent7: Observable<number>;
  urlmini4: string;

  idProd: string;

  images = {
    imagen1: '',
    imagen2: '',
    imagen3: '',
    miniatura: '',
    miniatura1: '',
    miniatura2: '',
    miniatura4: ''
  };

  typePrd: string;

  constructor(private productoSvc: ProductsService,
              private ps5Svc: Productps5Service,
              private fisicoSvc: FisicosService,
              private route: ActivatedRoute,
              private router: Router,
              private storage: AngularFireStorage) {
    const id = this.route.snapshot.paramMap.get('id');
    this.idProd = id;
  }

    editProductForm = new FormGroup({
      id: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
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
    console.log(this.productoSvc.tipo);  
    if (!this.productoSvc.tipo) {
      this.router.navigate(['/administrador']);
    }
  }

  ngAfterViewInit(): void {
    console.log(this.idProd);
    if (this.productoSvc.tipo === 'Ps4') {
      setTimeout(() => {
        this.cargarps4(this.idProd);
      }, 500);
     
    }
    if (this.productoSvc.tipo === 'ps5') {
      setTimeout(() => {
        this.cargarps5(this.idProd);
      }, 500);      
    }   
    if (this.productoSvc.tipo === 'fisicos') {
      setTimeout(() => {
        this.cargarFisicos(this.idProd);
      }, 500);      
    }             
  }

  cargarps4(idparam){
    this.productoSvc.getProductById(idparam)
                    .subscribe((resp: any) => {
                      this.producto = resp;
                      this.producto.id = idparam;
                      this.image = this.producto.imageProd;
                      this.imageOriginal = this.producto.imageProd;
                      this.typePrd = this.producto.tipo;
                      this.initValuesForm();
                      this.imagenes = this.producto.images;
                      this.imagen1 =  this.imagenes.imagen1;
                      this.imagen2 =  this.imagenes.imagen2;
                      this.imagen3 =  this.imagenes.imagen3;
                      this.mini =  this.imagenes.miniatura;
                      this.mini1 =  this.imagenes.miniatura1;
                      this.mini2 =  this.imagenes.miniatura2;
                      this.mini4 =  this.imagenes.miniatura4;
                    });
  }

  cargarps5(idparam){
    this.ps5Svc.getProductByIdPs5(idparam)
                    .subscribe((resp: any) => {
                      this.producto = resp;
                      console.log(this.producto);                      
                      this.producto.id = idparam;
                      this.image = this.producto.imageProd;
                      this.imageOriginal = this.producto.imageProd;
                      this.typePrd = this.producto.tipo;
                      this.initValuesForm();
                      this.imagenes = this.producto.images;
                      this.imagen1 =  this.imagenes.imagen1;
                      this.imagen2 =  this.imagenes.imagen2;
                      this.imagen3 =  this.imagenes.imagen3;
                      this.mini =  this.imagenes.miniatura;
                      this.mini1 =  this.imagenes.miniatura1;
                      this.mini2 =  this.imagenes.miniatura2;
                      this.mini4 =  this.imagenes.miniatura4;
                    });
  }

  cargarFisicos(idparam){
    this.fisicoSvc.getProductByIdFisicos(idparam)
                    .subscribe((resp: any) => {
                      this.producto = resp;
                      console.log(this.producto);                      
                      this.producto.id = idparam;
                      this.image = this.producto.imageProd;
                      this.imageOriginal = this.producto.imageProd;
                      this.typePrd = this.producto.tipo;
                      this.initValuesForm();
                      this.imagenes = this.producto.images;
                      this.imagen1 =  this.imagenes.imagen1;
                      this.imagen2 =  this.imagenes.imagen2;
                      this.imagen3 =  this.imagenes.imagen3;
                      this.mini =  this.imagenes.miniatura;
                      this.mini1 =  this.imagenes.miniatura1;
                      this.mini2 =  this.imagenes.miniatura2;
                      this.mini4 =  this.imagenes.miniatura4;
                    });
  }

  

  editProduct(prd: Producto){
    if (this.productoSvc.tipo === 'Ps4') {
      this.editProductPs4(prd);
    }
    if (this.productoSvc.tipo === 'ps5') {
      this.editProductPs5(prd);
    }
    if (this.productoSvc.tipo === 'fisicos') {
      this.updateProductFisico(prd);
    }
  }

  editProductPs4(prd: Producto){
    console.log(this.productoSvc.tipo);    
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
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        } else {
          this.productoSvc.updateProductById(prd, this.image).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        }
      }
    });    
  }

  editProductPs5(prd: Producto){
    console.log(this.productoSvc.tipo);    
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
          this.ps5Svc.updateProductPs5ById(prd).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        } else {
          this.ps5Svc.updateProductPs5ById(prd, this.image).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        }
      }
    });    
  } 

  updateProductFisico(prd: Producto){
    console.log(this.productoSvc.tipo);    
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
          this.fisicoSvc.updateProductById(prd).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        } else {
          this.fisicoSvc.updateProductById(prd, this.image).then(() => {
            Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            this.router.navigate(['/administrador']);
          }).catch((error) => {
            Swal.fire('Error!', 'Error al editar el producto', 'error');
          });
        }
      }
    });    
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

  handleImage1(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent1 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlImage1 = urlImg;
        this.images.imagen1 = this.urlImage1;
      });
    })).subscribe();
  }

  handleImage2(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent2 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlImage2 = urlImg;
        this.images.imagen2 = this.urlImage2;
      });
    })).subscribe();
  }

  handleImage3(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent3 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlImage3 = urlImg;
        this.images.imagen3 = this.urlImage3;
      });
    })).subscribe();
  }

  handleMini(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent5 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlmini = urlImg;
        this.images.miniatura = this.urlmini;
      });
    })).subscribe();
  }

  handleMini1(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent6 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlmini1 = urlImg;
        this.images.miniatura1 = this.urlmini1;
      });
    })).subscribe();
  }

  handleMini2(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent4 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlmini2 = urlImg;
        this.images.miniatura2 = this.urlmini2;
      });
    })).subscribe();
  }

  handleMini4(event){
    const idImg = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `productos/prds_${idImg}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent7 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe( urlImg => {
        this.urlmini4 = urlImg;
        this.images.miniatura4 = this.urlmini4;
      });
    })).subscribe();
  }

  updateGalery(){
    if (this.urlImage1 === undefined) {
      this.urlImage1 = this.imagen1;
      this.images.imagen1 = this.urlImage1;
    }
    if (this.urlImage2 === undefined) {
      this.urlImage2 = this.imagen2;
      this.images.imagen2 = this.urlImage2;
    }
    if (this.urlImage3 === undefined) {
      this.urlImage3 = this.imagen3;
      this.images.imagen3 = this.urlImage3;
    }
    if (this.urlmini === undefined) {
      this.urlmini = this.mini;
      this.images.miniatura = this.mini;
    }
    if (this.urlmini1 === undefined) {
      this.urlmini1 = this.mini1;
      this.images.miniatura1 = this.mini1;
    }
    if (this.urlmini2 === undefined) {
      this.urlmini2 = this.mini2;
      this.images.miniatura2 = this.mini2;
    }
    if (this.urlmini4 === undefined) {
      this.urlmini4 = this.mini4;
      this.images.miniatura4 = this.mini4;
    }
    this.productoSvc.galeriaProductos(this.idProd, this.images).then(() => window.location.reload());

  }

}
