import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/users.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  passwordView = false;
  usuario: User;
  validate = true;

  registerForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authSvc: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(registro: any){
    if (this.registerForm.invalid){
      Swal.fire({
        title: 'Error...',
        text: 'Debe ingresar la información requerida',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
      return Object.values( this.registerForm.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    this.authSvc.verifyUserByEmail(registro.email)
                .subscribe(usr => {
                  if (usr.length > 0) {
                   if (this.validate) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'El correo electrónico ingresado ya esta registrado!',
                      footer: 'Intenta con uno diferente'
                    });
                   }
                  }
                  if (usr.length === 0) {
                    Swal.fire({
                      title: 'Creación de cuenta',
                      text: 'Va a crear una cuenta en EjePlay',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Si, crear cuenta!'
                    }).then((result) => {
                      const {email, password } = this.registerForm.value;
                      const user = this.authSvc.register(email, password);
                      if (user) {
                          console.log(user.then(userData => {
                            const id = userData.user.uid;
                            const datos = {
                              id: userData.user.uid,
                              email: userData.user.email
                            };
                            if (result.value) {
                              this.authSvc.sendEmailVerification();
                              Swal.fire(
                                email,
                                'Cuenta creada correctamente, se ha enviado un email para que por favor verfique su cuente y pueda iniciar sesión.',
                                'success'
                              );
                              this.validate = false;
                              this.authSvc.createUserData(id, datos);
                              this.authSvc.logout();
                              this.router.navigate(['/login']);
                            }
                          }));
                      }
                    });
                  }
                });
  }

  viewPassActive(){
    this.passwordView = true;
  }

  viewPassInActive(){
    this.passwordView = false;
  }

  get emailNoValido() {
    return this.registerForm.get('email').invalid && this.registerForm.get('email').touched;
  }
  get passwordNoValido() {
    return this.registerForm.get('password').invalid && this.registerForm.get('password').touched;
  }

}
