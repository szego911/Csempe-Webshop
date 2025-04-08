import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from '../../../services/indexedDB.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Car {
  id?: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-car-manager',
  imports: [FormsModule, CommonModule],
  templateUrl: './car-manager.component.html',
})
export class CarManagerComponent implements OnInit {
  cars: Car[] = [];
  newCar: Car = { name: '', price: 0 };

  constructor(private dbService: IndexedDBService) {}

  async ngOnInit() {
    await this.loadCars();
  }

  async loadCars() {
    this.cars = await this.dbService.getAllData();
  }

  async addCar() {
    if (!this.newCar.name || this.newCar.price <= 0) return;
    await this.dbService.addData(this.newCar);
    this.newCar = { name: '', price: 0 };
    await this.loadCars();
  }

  async deleteCar(id: number) {
    await this.dbService.deleteData(id);
    await this.loadCars();
  }
}
