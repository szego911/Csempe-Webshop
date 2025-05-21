import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.model';
import { CarCardComponent } from '../car-card/car-card.component';
import { SyncService } from '../../services/sync.service';

@Component({
  selector: 'app-popular-cars',
  standalone: true,
  imports: [CommonModule, CarCardComponent],
  templateUrl: './popular-cars.component.html',
  styleUrls: ['./popular-cars.component.scss'],
})
export class PopularCarsComponent implements OnInit {
  popularCars: Car[] = [];

  constructor(private syncService: SyncService) {}

  async ngOnInit(): Promise<void> {
    this.popularCars = (await this.syncService.getCars())
      .filter((car) => car.uzemanyag)
      .slice(0, 6);
  }
}
