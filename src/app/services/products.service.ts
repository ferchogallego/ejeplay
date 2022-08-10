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

  tipo: string;

  divisa = 'COP';
  userActive = false;

  // búsqueda desde barra
  termino: string;
  search: boolean;

  // catalogo en ofertas
  ofertas: boolean;

  // catalogo fisico
  fisicos: boolean;

  // opciones de menu catalogo
  catalogo: boolean;

  departamentosList: any;

  datosCompra: any;

  dataPayu: any;  

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) {
   this.productosCollection = db.collection<Producto>('productos');
   this.orderCollection = db.collection<Order>('carShop');
   this.departamentos();
  }

  departamentos(){
    this.departamentosList = [
      {
        nombre: 'cundinamarca',
        ciudades: ['bogota', 'soacha']
      },
      {
        nombre: 'antioquia',
        ciudades: ['medellin', 'itagui','envigado', 'apartado', 'turbo', 'rionegro', 'caucasia', 'bello']
      },
      {
        nombre: 'santander',
        ciudades: ['bucaramanga', 'floridablanca','giron', 'barrancabermeja', 'piedecuesta']
      },
      {
        nombre: 'nariño',
        ciudades: ['pasto', 'tumaco']
      },
      {
        nombre: 'guajira',
        ciudades: ['riohacha', 'maicao']
      },
      {
        nombre: 'atlantico',
        ciudades: ['barranquilla', 'soledad']
      },
      {
        nombre: 'casanare',
        ciudades: ['yopal']
      },
      {
        nombre: 'tolima',
        ciudades: ['ibague']
      },
      {
        nombre: 'meta',
        ciudades: ['villavicencio']
      },
      {
        nombre: 'magdalena',
        ciudades: ['santa marta']
      },
      {
        nombre: 'cesar',
        ciudades: ['valledupar']
      },
      {
        nombre: 'bolivar',
        ciudades: ['cartagena']
      },
      {
        nombre: 'norte de santander',
        ciudades: ['cucuta']
      },
      {
        nombre: 'cordoba',
        ciudades: ['monteria']
      },
      {
        nombre: 'huila',
        ciudades: ['neiva']
      },
      {
        nombre: 'cauca',
        ciudades: ['popayan']
      },
      {
        nombre: 'sucre',
        ciudades: ['sincelejo']
      },
      {
        nombre: 'boyaca',
        ciudades: ['tunja']
      },
      {
        nombre: 'caqueta',
        ciudades: ['florencia']
      },
      {
        nombre: 'choco',
        ciudades: ['quibdo']
      },
      {
        nombre: 'valle del cauca',
        ciudades: ['cali', 'buenaventura', 'palmira', 'tulua', 'alcala', 'ulloa', 'caicedonia', 'sevilla', 'cartago', 'ansermanuevo', 'zaragoza', 'obando', 'la victoria', 'zarzal', 'la paila', 'roldanillo', 'la union', 'toro']
      },
      {
        nombre: 'caldas',
        ciudades: ['manizales' , 'chinchina', 'villamaria', 'viterbo', 'anserma', 'riosucio', 'supia']
      },
      {
        nombre: 'quindio',
        ciudades: ['filandia' , 'circasia', 'salento', 'armenia', 'calarca', 'montenegro', 'quimbaya', 'la tebaida', 'pueblo tapao', 'barcelona']
      },
      {
        nombre: 'risaralda',
        ciudades: ['la virginia' , 'belen de umbria', 'guatica', 'quinchia', 'marsella', 'santa rosa de cabal', 'pereira', 'dosquebradas', 'pereira-extra']
      },

    ];

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

  cargarProductosOrdenFecha(){
    return this.db.collection('productos', ref => ref
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
    return this.db.collection('productos', ref => ref
                  .orderBy('nombre').limit(10))
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
                  .where('oferta', '>', 0).limit(10))
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
    return this.db.collection('productos', ref => ref
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

  loadGameFisicoById(id: string){
    return this.db.collection('fisicos').doc(id).valueChanges();
  }
  loadGamePs5ById(id: string){
    return this.db.collection('poductosPs5').doc(id).valueChanges();
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
  loadGamesByCategoryPs5(categoria){
    return this.db.collection('productosPs5', ref => ref
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
                  .where('usuario', '==', userId))
                  .snapshotChanges()
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

  sailFinalProccess(order: any){
    return this.db.collection('salesFinal').add(order);
  }

  saleProcessReference(id: string, referencia: string){
    this.db.collection('carShop').doc(id).update({
      RefCompra: referencia
    });
  }

  cancelSaleProcess(referencia: any){
    return this.db.collection('sales/', ref => ref
                  .where('reference', '==', referencia))
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

  deleteSaleCancel(idSale: string){
    return this.db.collection('sales').doc(idSale).delete();
  }

  deleteCarByReference(referencia: any, userId: string){
    return this.db.collection('carShop/', ref => ref
                  .where('estado', '==', 'Pendiente')
                  .where('usuario', '==', userId)
                  .where('RefCompra', '==', referencia))
                  .snapshotChanges()
                  .pipe(
                   map(actions =>
                    actions.map(resp => {
                    const data = resp.payload.doc.data() as Order;
                    const id = resp.payload.doc.id;
                    return {id, ...data};
                    }))
                   );
  }
  deleteCarCancel(idCar: string){
    this.db.collection('carShop').doc(idCar).update({
      RefCompra: 'null'
    });
  }

  validateSale(userId: string, referencia: string){
    return this.db.collection('salesFinal/', ref => ref
                  .where('refCompra', '==', referencia)
                  .where('estado', '==', 'Pendiente')
                  .where('cliente', '==', userId)).snapshotChanges()
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
    return this.db.collection('salesFinal').doc(id).update({estado : 'Aprobada'});
  }

  updateSaleRejected(id: string){
    return this.db.collection('salesFinal').doc(id).update({estado : 'Rechazada'});
  }

  pedidosCancelados(idSale: string){
    return this.db.collection('salesFinal').doc(idSale).update({estado : 'Rechazada'});
  }

  pedidosAprobado(idSale: string){
    return this.db.collection('salesFinal').doc(idSale).update({estado: 'Aprobada'});
  }

  cantPedidos(userId: string){
    return this.db.collection('carShop/', ref => ref
    .where('estado', '==', 'Pendiente')
    .where('usuario', '==', userId)).valueChanges();
   }

   purchasesByBuyer(idUser: string){
    return this.db.collection('salesFinal/', ref => ref
    .where('cliente', '==', idUser))
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
   loadSaleByReference(compra: string){
    return this.db.collection('carShop/', ref => ref
    .where('RefCompra', '==', compra)).valueChanges();
   }
   loadSalesAdmin(){
     return this.db.collection('salesFinal', ref => ref 
                   .orderBy('fecha', 'desc'))
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
    return this.db.collection('salesFinal/', ref => ref
                  .where('estado', '==', estado)
                  .orderBy('fecha', 'desc'))
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
   loadSalesAdminByReference(rfce: string){
    return this.db.collection('salesFinal/', ref => ref
                  .where('refCompra', '==', rfce))
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

   updateStorage(compra: any){
    localStorage.setItem('carShoEjePlay', JSON.stringify(compra));
  }

  cargarComentarioJuego(datos: any){
    this.db.collection('comentarios').add(datos);
  }

  cargarComentariosPorIdJuego(idJuego: string){
    return this.db.collection('comentarios', ref => ref
                  .where('idJuego', '==', idJuego)
                  .where('estado', '==', 'Aceptado'))
                  .valueChanges();
  }

  galeriaProductos(idProducto: string, galeria: any){
    return this.db.collection('productos').doc(idProducto).update({images: galeria});
  }

  generarCuponAdmin(cupon: any){
    return this.db.collection('cupones').add(cupon);
  }

  cargarCupones(){
    return this.db.collection('cupones')
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
  elimimarCuponPorId(idCupon: string){
    return this.db.collection('cupones').doc(idCupon).delete();
  }
  consultaCuponAdmin(cod: string){
    return this.db.collection('cupones', ref => ref
                  .where('codigo', '==', cod))
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

  cargarComentarionRevision(){
    return this.db.collection('comentarios', ref => ref
                  .where('estado', '==', 'Revision'))
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

  aceptarComentario(idComent: string){
    return this.db.collection('comentarios').doc(idComent).update({estado: 'Aceptado'});
  }

  borrarComentario(idComent: string){
    return this.db.collection('comentarios').doc(idComent).delete();
  }
}
