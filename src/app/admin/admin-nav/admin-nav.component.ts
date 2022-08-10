import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent implements OnInit {

  constructor(private authSvc: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onLogout(){
    try {
      await this.authSvc.logout();
      this.router.navigate(['/admin']);
    } catch (error) {
      console.log(error);
    }
   }

}
