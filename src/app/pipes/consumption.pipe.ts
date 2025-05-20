import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consumptionUnit',
})
export class ConsumptionUnitPipe implements PipeTransform {
  transform(type: string): string {
    return type?.toLowerCase().includes('elektromos') ? 'kWh/100km' : 'l/100km';
  }
}
