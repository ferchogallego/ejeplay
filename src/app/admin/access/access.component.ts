import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {

  constructor(private authSvc: AuthService,
              private router: Router) { }

  loginFormAdmin = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  ngOnInit(): void {
  }

  onLoginAdmin(){
    const {email, password } = this.loginFormAdmin.value;
    try {
      const user = this.authSvc.login(email, password);
      if (user) {
        this.onLoginRedirect();
      }
    } catch (error) {
      console.log(error);
    }
  }

  onLoginRedirect(){
    this.router.navigate(['/administrador']);
  }

}
