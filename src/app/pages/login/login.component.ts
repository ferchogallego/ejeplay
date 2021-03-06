import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passwordView = false;
  load = false;
  public usr = this.authSvc.afAuth.user;

  loginForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authSvc: AuthService,
              private router: Router,
              private productoSvc: ProductsService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.usr.subscribe(usuario => {
      if (!usuario.emailVerified) {
        this.router.navigate(['/verificacion']);
      }
    });
    setTimeout(() => {
      this.load = true;
    }, 1000);
  }

  onLogin(){
    const {email, password } = this.loginForm.value;
    try {
      const user = this.authSvc.login(email, password);
      if (user) {
        user.then(usr => {
          if (!usr.user.emailVerified) {
           this.router.navigate(['/verificacion']);
          }
          if (usr.user.emailVerified) {
            this.productoSvc.userActive = true;
            this.onLoginRedirect();
            Swal.fire({
              title: 'Bienvenido',
              text: 'Gracias por visitar Eje Play',
              icon: 'success',
              allowOutsideClick: false,
              showCloseButton: true
            });
          }
        }).catch(err => {
          Swal.fire({
            title: 'Error...',
            text: 'Email o contraseña inválidos, verifique',
            icon: 'error',
            allowOutsideClick: false,
            showCloseButton: true
          });
        });
      }
    } catch (error) {
    }
  }

  onLoginFacebook(){
    this.authSvc.loginFacebook().then(resp => {
      const id = resp.user.uid;
      const datos = {
                  id: resp.user.uid,
                  email: resp.user.email,
                  fecha: new Date().getTime(),
                  cuponInicio: 'No'
                };
      this.authSvc.verifyUser(id)
                  // tslint:disable-next-line: deprecation
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
                  email: resp.user.email,
                  fecha: new Date().getTime(),
                  cuponInicio: 'No'
                };
      this.authSvc.verifyUser(id)
                  // tslint:disable-next-line: deprecation
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
  }

  viewPassInActive(){
    this.passwordView = false;
  }

  get emailNoValido() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched;
  }
  get passwordNoValido() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

}
