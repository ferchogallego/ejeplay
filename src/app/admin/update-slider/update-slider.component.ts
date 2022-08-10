import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-update-slider',
  templateUrl: './update-slider.component.html',
  styleUrls: ['./update-slider.component.scss']
})
export class UpdateSliderComponent implements OnInit {

  slider: any;
  imagen1: string;
  imagen2: string;
  imagen3: string;

  imageSrc: any;
  image: any;

  constructor(private produtoSvc: ProductsService) { }

  ngOnInit(): void {
    this.produtoSvc.cargarSlider()
                   .subscribe( resp => {
                     this.slider = resp;
                     this.imagen1 = this.slider.imagen1;
                     this.imagen2 = this.slider.imagen2;
                     this.imagen3 = this.slider.imagen3;
                   });
  }

  changeImageSlider(numImg: string){
    console.log(numImg);
    if (numImg === 'imagen1') {
      this.produtoSvc.updateSlider1(this.image);
    }
    if (numImg === 'imagen2') {
      this.produtoSvc.updateSlider2(this.image);
    }
    if (numImg === 'imagen3') {
      this.produtoSvc.updateSlider3(this.image);
    }
  }

  handleImage(event: any){
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

}
