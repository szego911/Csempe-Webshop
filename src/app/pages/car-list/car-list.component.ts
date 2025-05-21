// car-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Car } from '../../models/car.model';
import { SyncService } from '../../services/sync.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarCardComponent } from '../../components/car-card/car-card.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [FormsModule, CommonModule, CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  selectedFuel: string = '';
  selectedValto: string = '';
  minSzemelyek: number | null = null;
  maxAr: number | null = null;

  constructor(private syncService: SyncService) {}

  async ngOnInit() {
    await this.loadCars();
  }

  async loadCars() {
    this.cars = await this.syncService.getCars();
  }

  filteredCars(): Car[] {
    return this.cars.filter(
      (car) =>
        (!this.selectedFuel || car.uzemanyag === this.selectedFuel) &&
        (!this.selectedValto || car.valto === this.selectedValto) &&
        (!this.minSzemelyek || car.szemelyek >= this.minSzemelyek) &&
        (!this.maxAr || car.ar_nap_ft <= this.maxAr)
    );
  }
}
