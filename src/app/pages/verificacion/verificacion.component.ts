import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
                  this.router.navigate(['/login']);
                });
  }

  retornar(){
    this.authSvc.logout();
    this.router.navigate(['/home']);
  }

}
