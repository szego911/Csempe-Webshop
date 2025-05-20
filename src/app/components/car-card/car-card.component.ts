import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.model';
import { ConsumptionUnitPipe } from '../../pipes/consumption.pipe';
import { IsAvailableDirective } from '../../directives/is-available.directive';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, ConsumptionUnitPipe, IsAvailableDirective],
  templateUrl: './car-card.component.html',
})
export class CarCardComponent {
  @Input() car!: Car;
}
