import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passwordView = true;
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
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.log(error);
    }
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
