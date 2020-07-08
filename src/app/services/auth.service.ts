import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
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

  login(email: string, password: string){
    try{
      return this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  logout(){
    try {
      this.afAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }
}
