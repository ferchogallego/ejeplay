import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  constructor(private authSvc: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  resend(){
    this.authSvc.sendEmailVerification()
                .then(() => {
                  this.authSvc.logout();
                  Swal.fire(
                    'Correo de verificación reenviado',
                    'Por favor revise su buzón de correo y su spam',
                    'success'
                  );
                  this.router.navigate(['/login']);
                });
  }

  retornar(){
    this.authSvc.logout();
    this.router.navigate(['/home']);
  }

}
