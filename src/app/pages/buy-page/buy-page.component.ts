import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buy-page',
  templateUrl: './buy-page.component.html',
  styleUrls: ['./buy-page.component.scss']
})
export class BuyPageComponent implements OnInit {

  constructor(public prodSvc: ProductsService) { }
  pago = false;
  numCertificacion: string;
  medio: string;
  comprobante: string;

  ngOnInit(): void {
    console.log('Compra: ', this.prodSvc.datosCompra);
    console.log('PayU: ', this.prodSvc.dataPayu);  
  }

  payu(){
    this.prodSvc.datosCompra.medio = 'PayU';
    console.log(this.prodSvc.datosCompra);
    this.prodSvc.sailFinalProccess(this.prodSvc.datosCompra);
      const pasarela = `
      <img src="../../../assets/img/logo_payu.png" alt="" width="90">
      <form method="post" action="https://checkout.payulatam.com/ppp-web-gateway-payu/">
      <input name="merchantId" type="hidden" value="${this.prodSvc.dataPayu.merchantid}">
      <input name="accountId" type="hidden" value="${this.prodSvc.dataPayu.accountId}">
      <input name="description" type="hidden" value="${this.prodSvc.dataPayu.nomProds}">
      <input name="referenceCode" type="hidden" value="${this.prodSvc.dataPayu.reference}">
      <input name="amount" type="hidden" value="${this.prodSvc.dataPayu.liquidacion}">
      <input name="tax" type="hidden" value="0">
      <input name="taxReturnBase" type="hidden" value="0">
      <input name="currency" type="hidden" value="COP">
      <input name="signature" type="hidden" value="${this.prodSvc.dataPayu.signature}">
      <input name="test" type="hidden" value="0">
      <input name="buyerEmail" type="hidden" value="${this.prodSvc.dataPayu.email}">
      <input name="responseUrl" type="hidden" value="https://www.ejeplaypereira.com/#/confirmacion">
      <input name="confirmationUrl" type="hidden" value="http://www.test.com/confirmation">
        <button type="submit" class="pago" (click)="ventaGenerada()">
            <i class="fa fa-credit-card" aria-hidden="true"> Aceptar </i>
        </button>
      </form>`;
      Swal.fire({
          title: 'Realizar Pago PAYU',
          icon: 'question',
          html: pasarela,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d33'
        });
  }

  bancolombia(){
    this.prodSvc.datosCompra.medio = 'Bancolombia';
    console.log(this.prodSvc.datosCompra);
    this.pago = true;
    this.numCertificacion = 'Ingrese el número de comprobante';
    this.medio = 'bancolombia';
  }

  nequi(){
    this.prodSvc.datosCompra.medio = 'Nequi';
    console.log(this.prodSvc.datosCompra);    
    this.pago = true;
    this.numCertificacion = 'Ingrese el número de la factura';
    this.medio = 'nequi';
  }

  daviplata(){
    this.prodSvc.datosCompra.medio = 'Daviplata';
    console.log(this.prodSvc.datosCompra);
    this.pago = true;
    this.numCertificacion = 'Ingrese el número de confirmación';
    this.medio = 'daviplata';
  }

  compra(){
    if (this.comprobante) {
      this.prodSvc.sailFinalProccess(this.prodSvc.datosCompra).then(() => Swal.fire('Compra enviada correctamente'));
    } else {
      Swal.fire('por favor indique el número de comprobante de su transacción');
      return;
    }
  }

}
