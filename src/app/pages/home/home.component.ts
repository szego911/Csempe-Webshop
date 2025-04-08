import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopularCarsComponent } from '../../components/popularCars/popular-cars.component';
import { CarManagerComponent } from '../admin/car-management/car-manager.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, PopularCarsComponent,CarManagerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}

