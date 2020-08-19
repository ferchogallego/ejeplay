import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {
  load = false;
  constructor(private productoSvc: ProductsService) { }

  ngOnInit(): void {
    this.productoSvc.termino = '';
    this.productoSvc.catalogo = false;
    setTimeout(() => {
      this.load = true;
    }, 2000);
  }

}
