import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase';
import { first } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData$: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFirestore) {
    this.userData$ = afAuth.authState;
  }

  async sendEmailVerification(): Promise<void>{
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

 register(email: string, password: string){
    try {
      return this.afAuth.createUserWithEmailAndPassword(email, password);
     } catch (error) {
      console.log(error);
    }
  }

  createUserData(id: string, user: any){
    return this.db.collection<User>('users').doc(id).set(user);
  }

  verifyUser(idUser: string){
    return this.db.collection('users', ref => ref
                  .where('id', '==', idUser))
                  .valueChanges();
  }

  verifyUserByEmail(email: string){
    return this.db.collection('users', ref => ref
                  .where('email', '==', email))
                  .valueChanges();
  }

  login(email: string, password: string){
    try{
      return this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  }
   loginGoogle(){
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
   }

   loginFacebook(){
    return this.afAuth.signInWithPopup(new auth.FacebookAuthProvider());
   }

  logout(){
    try {
      this.afAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  verificarCuponesUsuarios(idUser: string){
    return this.db.collection('users').doc(idUser).valueChanges();
  }

  usarCuponRegistro(idUser: string){
    return this.db.collection('users').doc(idUser).update({cuponInicio: 'Si'});
  }

  resetPassword(email: string){
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }
}
