import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from '../../../services/indexedDB.service';
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
  felszereltsegInput: string = '';

  uzemanyagTipusok = ['Benzin', 'Dízel', 'Elektromos', 'Hibrid'];
  valtoTipusok = ['Manuális', 'Automata'];

  constructor(private dbService: IndexedDBService) {}

  async ngOnInit() {
    await this.loadCars();
  }

  async loadCars() {
    this.cars = await this.dbService.getAllData();
  }

  async addCar() {
    if (!this.isValidCar(this.newCar)) return;

    await this.dbService.addData(this.newCar);
    this.newCar = this.getEmptyCar();
    this.felszereltsegInput = '';
    await this.loadCars();
  }

  getEmptyCar(): Car {
    return {
      id: 0, // automatikusan generálódik az IndexedDB-ben
      marka: '',
      evjarat: new Date().getFullYear(),
      uzemanyag: '',
      motor: '',
      valto: '',
      szemelyek: 5,
      fogyasztas_l_100km: undefined,
      fogyasztas_kwh_100km: undefined,
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

  updateFelszereltseg() {
    this.newCar.felszereltseg = this.felszereltsegInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  async deleteCar(id: number) {
    await this.dbService.deleteData(id);
    await this.loadCars();
  }
}
