import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../../services/sync.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Car } from '../../car-list/car.model';

@Component({
  selector: 'app-car-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './car-manager.component.html',
})
export class CarManagerComponent implements OnInit {
  cars: Car[] = [];
  newCar: Car = this.getEmptyCar();

  currentYear = new Date().getFullYear();
  uzemanyagtipusok = ['Benzin', 'Dízel', 'Elektromos', 'Hibrid'];
  valtotipusok = ['Manuális', 'Automata'];
  felszerelesTipusok = ['Klíma', 'Navigáció', 'Bluetooth', 'Tempomat'];

  updateFelszereltseg(felszereles: string, checked: boolean) {
    const index = this.newCar.felszereltseg.indexOf(felszereles);
    if (checked && index === -1) {
      this.newCar.felszereltseg.push(felszereles);
    } else if (!checked && index !== -1) {
      this.newCar.felszereltseg.splice(index, 1);
    }
  }

  constructor(private syncService: SyncService) {}

  async ngOnInit() {
    await this.loadCars();
  }

  async loadCars() {
    this.cars = await this.syncService.getCars();
  }

  async addCar() {
    if (!this.isValidCar(this.newCar)) return;

    await this.syncService.addCar(this.newCar);
    this.newCar = this.getEmptyCar();
    await this.loadCars();
  }

  async deleteCar(id: number) {
    await this.syncService.deleteCar(id.toString());
    await this.loadCars();
  }

  getEmptyCar(): Car {
    return {
      id: 0,
      marka: '',
      evjarat: new Date().getFullYear(),
      uzemanyag: '',
      motor: '',
      valto: '',
      szemelyek: 5,
      fogyasztas_l_100km: undefined,
      ar_nap_ft: 0,
      autopalya_matrica: false,
      felszereltseg: [],
    };
  }

  isValidCar(car: Car): boolean {
    if (
      !car.marka.trim() ||
      !car.uzemanyag ||
      !car.motor.trim() ||
      !car.valto ||
      car.evjarat < 1900 ||
      car.evjarat > new Date().getFullYear() ||
      car.szemelyek <= 0 ||
      car.ar_nap_ft <= 0
    ) {
      alert('Kérlek, töltsd ki helyesen az összes kötelező mezőt!');
      return false;
    }
    return true;
  }
}
