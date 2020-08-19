import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Producto } from '../shared/producto.interface';
import { FileI } from '../shared/file.interface';
import { map, finalize } from 'rxjs/operators';
import { Order } from '../shared/order.interface';
import { SaleI } from '../shared/sale.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productosCollection: AngularFirestoreCollection<Producto>;
  private orderCollection: AngularFirestoreCollection<Order>;
  private filePath: any;
  private downloadURL: string;

  divisa = 'COP';
  userActive = false;

  // búsqueda desde barra
  termino: string;
  search: boolean;

  // catalogo en ofertas
  ofertas: boolean;

  // opciones de menu catalogo
  catalogo: boolean;

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) {
   this.productosCollection = db.collection<Producto>('productos');
   this.orderCollection = db.collection<Order>('carShop');
  }

  cargarSlider(){
    return this.db.collection('slider').doc('6aqfIyRj6gHQ3tcel3nb')
                                       .valueChanges();
  }

  updateSlider1(image: FileI){
    this.filePath = `slider/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          return this.db.collection('slider')
          .doc('6aqfIyRj6gHQ3tcel3nb')
          .update({imagen1 : this.downloadURL}).then(resp => {
            console.log(this.downloadURL);
          });
        });
      })
    ).subscribe();
  }
  updateSlider2(image: FileI){
    this.filePath = `slider/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          return this.db.collection('slider')
          .doc('6aqfIyRj6gHQ3tcel3nb')
          .update({imagen2 : this.downloadURL}).then(resp => {
            console.log(this.downloadURL);
          });
        });
      })
    ).subscribe();
  }
  updateSlider3(image: FileI){
    this.filePath = `slider/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          return this.db.collection('slider')
          .doc('6aqfIyRj6gHQ3tcel3nb')
          .update({imagen3 : this.downloadURL}).then(resp => {
            console.log(this.downloadURL);
          });
        });
      })
    ).subscribe();
  }

  cargarProductos(){
    return this.productosCollection.snapshotChanges()
               .pipe(
                 map(actions =>
                  actions.map(resp => {
                    const data = resp.payload.doc.data() as Producto;
                    const id = resp.payload.doc.id;
                    return {id, ...data};
                  }))
               );
  }

  loadGamesForPrice(precio: number){
    return this.db.collection('productos', ref => ref
                  .where('precio', '<=', precio))
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

  loadStarterGames(){
    return this.db.collection('productos', ref => ref.orderBy('nombre').limit(8))
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
  loadGamesForOffer(){
    return this.db.collection('productos', ref => ref
                  .where('oferta', '>', 0))
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
  loadStarterOffers1(){
    return this.db.collection('productos', ref => ref
                  .where('oferta', '>', 0)
                  .where('oferta', '<', 20).limit(4))
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
  loadStarterOffers2(){
    return this.db.collection('productos', ref => ref
                  .where('oferta', '>', 20).limit(4))
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

  getProductById(id: string){
    return this.productosCollection.doc(id).valueChanges();
  }

  filterProd(producto: Producto, image: FileI){
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
      return this.productosCollection.doc(producto.id).update(prodObj);
    } else {
      return this.productosCollection.add(prodObj);
    }
  }

  updateProductById(producto: Producto, newImage?: FileI){
    if (newImage) {
      this.uploadImage(producto, newImage);
    } else {
      return this.productosCollection.doc(producto.id).update(producto);
    }
  }

  deletePostById(producto: Producto) {
    return this.productosCollection.doc(producto.id).delete();
  }

  loadDolarValue(){
    return this.db.collection('divisa').doc('I2kEyodQvmIlXII3Ky0z')
                  .valueChanges();
  }

  loadGameById(id: string){
    return this.productosCollection.doc(id).valueChanges();
  }

  loadGamesByCategory(categoria){
    return this.db.collection('productos', ref => ref
                  .where('categoria', '==', categoria).limit(4))
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
  loadByCategory(categoria){
    return this.db.collection('productos', ref => ref
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


  cargarPedido(order: Order){
    return this.orderCollection.add(order);
  }

  cargarCompras(userId: string){
    return this.db.collection('carShop/', ref => ref
                  .where('estado', '==', 'Pendiente')
                  .where('usuario', '==', userId)).snapshotChanges()
                  .pipe(
                   map(actions =>
                    actions.map(resp => {
                    const data = resp.payload.doc.data() as Order;
                    const id = resp.payload.doc.id;
                    return {id, ...data};
                    }))
                   );
   }

   deleteItemCarById(id: string, userId: string){
    return this.db.collection('carShop/', ref => ref
   .where('estado', '==', 'Pendiente')
   .where('usuario', '==', userId)).doc(id).delete();
  }

  sailProcesss(referencia: string, buyer: string, total: number, fecha: any, pago: string, estado: string){
    return this.db.collection('sales').add({
      reference: referencia,
      comprador: buyer,
      precio: total,
      comprado: fecha,
      medio: pago,
      state: estado
    });
  }

  saleProcessReference(userId: string, referencia: any){
    return this.db.collection('carShop/', ref => ref
                  .where('estado', '==', 'Pendiente')
                  .where('usuario', '==', userId)).snapshotChanges()
                  .pipe(
                    map(actions =>
                      actions.map(resp => {
                        const data = resp.payload.doc.data();
                        const id = resp.payload.doc.id;
                        let conIf = 0;
                        this.db.collection('carShop/').doc(id).update({
                          RefCompra: referencia
                        }).then(result => {
                            conIf++;
                            // tslint:disable-next-line: no-string-literal
                            if (conIf === data['docs']['length']){
                                return(conIf);
                              }
                          });
                      }))
                  );
  }

  validateSale(userId: string, referencia: string){
    return this.db.collection('sales/', ref => ref
                  .where('reference', '==', referencia)
                  .where('state', '==', 'Procesandose')
                  .where('comprador', '==', userId)).snapshotChanges()
                  .pipe(
                   map(actions =>
                    actions.map(resp => {
                    const data = resp.payload.doc.data() as SaleI;
                    const id = resp.payload.doc.id;
                    return {id, ...data};
                    }))
                   );
  }
  updateSale(userId: string, referencia: string){
    return this.db.collection('sales/', ref => ref
                  .where('reference', '==', referencia)
                  .where('comprador', '==', userId)).snapshotChanges()
                  .pipe(
                   map(actions =>
                    actions.map(resp => {
                    const data = resp.payload.doc.data() as SaleI;
                    const id = resp.payload.doc.id;
                    return {id, ...data};
                    }))
                   );
  }

  updateSaleAccepted(id: string){
    return this.db.collection('sales').doc(id).update({state : 'Aprobada'});
  }

  updateSaleRejected(id: string){
    return this.db.collection('sales').doc(id).update({state : 'Rechazada'});
  }

  pedidos(userId: string, referencia: string){
    return this.db.collection('carShop/', ref => ref
                  .where('RefCompra', '==', referencia)
                  .where('usuario', '==', userId)).snapshotChanges()
                  .pipe(
                    map(actions =>
                      actions.map(resp => {
                        const data = resp.payload.doc.data();
                        const id = resp.payload.doc.id;
                        let conIf = 0;
                        this.db.collection('carShop/').doc(id).update({
                          estado : 'Venta',
                        }).then(result => {
                            conIf++;
                            // tslint:disable-next-line: no-string-literal
                            if (conIf === data['docs']['length']){
                                return(conIf);
                              }
                          });
                      }))
                  );
  }
  pedidosCancelados(idSale: string){
    return this.db.collection('sales').doc(idSale).delete();
  }

  cantPedidos(userId: string){
    return this.db.collection('carShop/', ref => ref
    .where('estado', '==', 'Pendiente')
    .where('usuario', '==', userId)).valueChanges();
   }

   purchasesByBuyer(id: string){
    return this.db.collection('sales/', ref => ref
    .where('comprador', '==', id)).valueChanges();
   }
   loadSaleByReference(compra: string){
    return this.db.collection('carShop/', ref => ref
    .where('RefCompra', '==', compra)).valueChanges();
   }
   loadSalesAdmin(){
     return this.db.collection('sales')
                   .snapshotChanges()
                   .pipe(
                     map(actions =>
                      actions.map(resp => {
                      const data = resp.payload.doc.data() as any;
                      const id = resp.payload.doc.id;
                      return {id, ...data};
                      }))
                     );
   }
   loadSalesAdminByState(estado: string){
    return this.db.collection('sales/', ref => ref
    .where('state', '==', estado)).valueChanges();
   }
   loadSalesAdminByReference(rfce: string){
    return this.db.collection('sales/', ref => ref
    .where('reference', '==', rfce)).valueChanges();
   }

   loadDollarPrice(){
     return this.db.collection('divisa')
                   .snapshotChanges()
                   .pipe(
                     map(actions =>
                      actions.map(resp => {
                      const data = resp.payload.doc.data() as any;
                      const id = resp.payload.doc.id;
                      return {id, ...data};
                      }))
                     );
   }

   changeDollarPrice(id: string, precio: number){
     return this.db.collection('divisa').doc(id).update({
       dolar: precio
     });
   }
}
