import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
   const resultProd = [];
   for (const prdto of value) {
      if ((prdto.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)
          || (prdto.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
        resultProd.push(prdto);
      }
    }
   return resultProd;
  }

}
