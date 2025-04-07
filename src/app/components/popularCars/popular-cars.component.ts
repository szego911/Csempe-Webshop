import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../../services/car.service';
import { Car } from '../../pages/car-list/car.model';
import { CarCardComponent } from '../../pages/car-list/car-card/car-card.component';

@Component({
  selector: 'app-popular-cars',
  standalone: true,
  imports: [CommonModule, CarCardComponent],
  templateUrl: './popular-cars.component.html',
})
export class PopularCarsComponent implements OnInit {
  popularCars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.popularCars = this.carService.getCars()
      .filter(car => car.uzemanyag)
      .slice(0, 6); // max 6 autó
  }
}
