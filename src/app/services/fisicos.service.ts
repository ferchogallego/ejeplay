import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { FileI } from '../shared/file.interface';
import { Producto } from '../shared/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class FisicosService {

  private filePath: any;
  private downloadURL: string;

  

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) {  
   
  }

  filterProdFisicos(producto: Producto, image: FileI){
    this.uploadImage(producto, image);
  }

  private uploadImage(producto: Producto, image: FileI){
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.agregarProductos(producto);
        });
      })
    ).subscribe();
 }

  agregarProductos(producto: Producto){
    const prodObj = {
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: producto.precio,
      cantPpal: producto.cantPpal,
      preciosec: producto.preciosec,
      cantSec: producto.cantSec,
      oferta: producto.oferta,
      categoria: producto.categoria,
      peso: producto.peso,
      idioma: producto.idioma,
      fechaCreacion: producto.fechaCreacion,
      imageProd: this.downloadURL,
      fileRef: this.filePath,
      descripcion: producto.descripcion
    };
    if (producto.id) {
      return this.db.collection('fisicos').doc(producto.id).update(prodObj);
    } else {
      return this.db.collection('fisicos').add(prodObj);
    }
  }

  cargarProductosOrdenFecha(){
    return this.db.collection('fisicos', ref => ref
                  .orderBy('fechaCreacion', 'desc'))
                  .snapshotChanges()
                   .pipe(
                     map(actions =>
                      actions.map(resp => {
                        const data = resp.payload.doc.data() as Producto;
                        const id = resp.payload.doc.id;
                        return {id, ...data};
                      }))
                   );
  }

  loadPhysicalProducts(){
    return this.db.collection('fisicos', ref => ref
                  .where('tipo', '==', 'fisico').limit(5))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as Producto;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }

  getProductByIdFisicos(id: string){
    return this.db.collection('fisicos').doc(id).valueChanges();
  }

  updateProductById(producto: Producto, newImage?: FileI){
    if (newImage) {
      this.uploadImage(producto, newImage);
    } else {
      return this.db.collection('fisicos').doc(producto.id).update(producto);
    }
  }

  loadByCategory(categoria){
    return this.db.collection('fisicos', ref => ref
                  .where('categoria', '==', categoria))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as Producto;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }
}
