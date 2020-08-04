import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passwordView = false;
  load = false;

  loginForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authSvc: AuthService,
              private router: Router,
              private productoSvc: ProductsService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.load = true;
    }, 1000);
  }

  onLogin(){
    const {email, password } = this.loginForm.value;
    try {
      const user = this.authSvc.login(email, password);
      if (user) {
        this.productoSvc.userActive = true;
        this.onLoginRedirect();
      }
    } catch (error) {
      console.log(error);
    }
  }

  onLoginFacebook(){
    this.authSvc.loginFacebook().then(resp => {
      const id = resp.user.uid;
      const datos = {
                  id: resp.user.uid,
                  email: resp.user.email
                };
      this.authSvc.verifyUser(id)
                  .subscribe(usr => {
                    if (usr.length === 0) {
                      this.authSvc.createUserData(id, datos)
                                  .then (save => this.onLoginRedirect());
                    }
                    if (usr.length > 0) {
                      this.onLoginRedirect();
                    }
                  });
    }).catch(err => console.log('Error', err.message));
  }

  onLoginGoogle(){
    this.authSvc.loginGoogle().then(resp => {
      const id = resp.user.uid;
      const datos = {
                  id: resp.user.uid,
                  email: resp.user.email
                };
      this.authSvc.verifyUser(id)
                  .subscribe(usr => {
                    if (usr.length === 0) {
                      this.authSvc.createUserData(id, datos)
                                  .then (save => this.onLoginRedirect());
                    }
                    if (usr.length > 0) {
                      this.onLoginRedirect();
                    }
                  });
      this.onLoginRedirect();
    }).catch(err => console.log('Error', err.message));
  }

  onLoginRedirect(){
    this.router.navigate(['/home']);
  }

  viewPassActive(){
    this.passwordView = true;
    console.log(this.passwordView);
  }

  viewPassInActive(){
    this.passwordView = false;
    console.log(this.passwordView);
  }

  get emailNoValido() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched;
  }
  get passwordNoValido() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

}
