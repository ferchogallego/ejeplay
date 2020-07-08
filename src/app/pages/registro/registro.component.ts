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

  passwordView = true;
  usuario: User;

  registerForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authSvc: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(){
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
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Creación de cuenta',
      text: 'Va a crear na cuenta en EjePlay',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, crear cuenta',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        const {email, password } = this.registerForm.value;
        try {
          const user = this.authSvc.register(email, password);
          if (user) {
              console.log(user.then(userData => {
                const id = userData.user.uid;
                const datos = {
                  id: userData.user.uid,
                  email: userData.user.email
                };
                swalWithBootstrapButtons.fire(
                  'Cuenta creada',
                  'Bienvenido a EjePlay.',
                  'success'
                );
                this.authSvc.createUserData(id, datos);
                this.router.navigate(['/login']);
              }));
          }
        } catch (error) {
          console.log(error);
        }
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Te esperamos en EjePlay :)',
          'error'
        );
      }
    });
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
    return this.registerForm.get('email').invalid && this.registerForm.get('email').touched;
  }
  get passwordNoValido() {
    return this.registerForm.get('password').invalid && this.registerForm.get('password').touched;
  }

}
