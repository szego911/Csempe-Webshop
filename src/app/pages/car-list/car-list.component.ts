// car-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Car } from './car.model';
import { CarService } from '../../services/car.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarCardComponent } from './car-card/car-card.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [FormsModule, CommonModule, CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  selectedFuel: string = '';
  selectedValto: string = '';
  minSzemelyek: number | null = null;
  maxAr: number | null = null;

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.cars = this.carService.getCars();
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
