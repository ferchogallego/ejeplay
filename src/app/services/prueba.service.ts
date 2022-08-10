import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PruebaService {

  constructor(public bd: AngularFirestore) { }

  cargarElementos(){
    return this.bd.collection('productos', ref => ref
                  .orderBy('nombre', 'asc'))
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

  cargarElementosPs5(){
    return this.bd.collection('poductosPs5', ref => ref
                  .orderBy('nombre', 'asc'))
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
  cargarElementosFisicos(){
    return this.bd.collection('fisicos', ref => ref
                  .orderBy('nombre', 'asc'))
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
  /* cargarElementos(){
    return new Promise((resolve, reject) => {
      this.bd.collection('productos', ref => ref
      .orderBy('nombre', 'asc'))
      .get().forEach(res => {
        if (res.empty){
          reject('error');
        }else{
          const datapro = [];
          res.forEach(res1 => {
            datapro.push(res1.data());
          });
          resolve(datapro);
          // console.log(datapro);
        }
      }).catch();
    });
  } */
  CargarElementosFecha(){
    return new Promise((resolve, reject) => {
      this.bd.collection('productos', ref => ref
      .orderBy('fechaCreacion', 'desc'))
      .get().forEach(res => {
        if (res.empty){
          reject('error');
        }else{
          const datapro = [];
          res.forEach(res1 => {
            datapro.push(res1.data());
          });
          resolve(datapro);
          // console.log(datapro);
        }
      }).catch();
    });
  }
  CargarElementosPrecioMayor(){
    return new Promise((resolve, reject) => {
      this.bd.collection('productos', ref => ref
      .orderBy('precio', 'desc'))
      .get().forEach(res => {
        if (res.empty){
          reject('error');
        }else{
          const datapro = [];
          res.forEach(res1 => {
            datapro.push(res1.data());
          });
          resolve(datapro);
          // console.log(datapro);
        }
      }).catch();
    });
  }
  CargarElementosPrecioMmenor(){
    return new Promise((resolve, reject) => {
      this.bd.collection('productos', ref => ref
      .orderBy('precio', 'asc'))
      .get().forEach(res => {
        if (res.empty){
          reject('error');
        }else{
          const datapro = [];
          res.forEach(res1 => {
            datapro.push(res1.data());
          });
          resolve(datapro);
          // console.log(datapro);
        }
      }).catch();
    });
  }

  agregarListaDeseos(lista: any){
    return this.bd.collection('listaDeseos').add(lista);
  }

  confirmarJuegoFavorito(idUsuario: string, idJuego: string){
    return new Promise((resolve, reject) => {
      this.bd.collection('listaDeseos', ref => ref
      .where('usuario', '==', idUsuario)
      .where('juego', '==', idJuego))
      .get().forEach(res => {
        if (res.empty){
          const dataList = [];
          resolve(dataList);
        }else{
          const dataList = [];
          res.forEach(res1 => {
            dataList.push(res1.data());
          });
          resolve(dataList);
          // console.log(datapro);
        }
      }).catch();
    });
    /* return this.bd.collection('listaDeseos', ref => ref
                  .where('usuario', '==', idUsuario)
                  .where('juego', '==', idJuego))
                  .valueChanges(); */
  }

  cargarFavoritos(idUsuario: string){
    return this.bd.collection('listaDeseos', ref => ref
                  .where('usuario', '==', idUsuario))
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

  borrarFavorito(idFavorito: string){
    return this.bd.collection('listaDeseos').doc(idFavorito).delete();
  }

}
