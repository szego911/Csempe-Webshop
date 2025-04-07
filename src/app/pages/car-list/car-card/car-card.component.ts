import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../car-list/car.model';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
})
export class CarCardComponent {
  @Input() car!: Car;
}
