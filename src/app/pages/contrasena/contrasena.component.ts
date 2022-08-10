import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.component.html',
  styleUrls: ['./contrasena.component.scss']
})
export class ContrasenaComponent implements OnInit {

  passwordForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    });
    get emailNoValido() {
      return this.passwordForm.get('email').invalid && this.passwordForm.get('email').touched;
    }
    constructor(private authSvc: AuthService,
                private router: Router) { }

    ngOnInit(): void {
    }

    cambiarContrasena(mail){
      if (this.passwordForm.invalid){
        Swal.fire({
          title: 'Error...',
          text: 'Debe ingresar la información requerida',
          icon: 'error',
          allowOutsideClick: false,
          showCloseButton: true
        });
        return Object.values( this.passwordForm.controls ).forEach( control => {
          if ( control instanceof FormGroup ) {
            // tslint:disable-next-line: no-shadowed-variable
            Object.values( control.controls ).forEach( control => control.markAsTouched() );
          } else {
            control.markAsTouched();
          }
        });
      }
      Swal.fire({
        title: 'Está seguro?',
        text: 'Se va a cambiar o restaurar su contraseña!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar!'
      }).then((result) => {
        if (result.isConfirmed) {
          const correo = mail.email;
          console.log(correo);
          this.authSvc.resetPassword(correo);
          this.router.navigate(['catalogo']);
          Swal.fire(
            'Enviado!',
            'Revisa por favor tu correo electrónico incluido spam, sigue las instrucciones e inicia sesión.',
            'success'
          );
        }
      });
    }
  }
