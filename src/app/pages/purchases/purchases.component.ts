import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  public user = this.authSvc.afAuth.user;
  load = false;
  perfilUser: any;
  lista: any;
  idUser: string;
  juegos: any;
  constructor(private productoSvc: ProductsService,
              private authSvc: AuthService) { }

  ngOnInit(): void {
    this.productoSvc.termino = '';
    this.productoSvc.catalogo = false;
    setTimeout(() => {
      this.load = true;
    }, 2000);
    this.user.subscribe(resp => {
      this.perfilUser = resp;
      this.idUser = this.perfilUser.uid;
      this.productoSvc.purchasesByBuyer(this.perfilUser.uid)
                      .subscribe(trans => {
                        this.lista = trans;
                      });
    });
  }
  openModal(ref: string){
    console.log(ref);
    this.productoSvc.loadSaleByReference(ref)
                    .subscribe(res => {
                      console.log(res);
                      this.juegos = res;
                    });
  }

}
