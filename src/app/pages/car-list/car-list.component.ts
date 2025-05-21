import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Car } from '../../models/car.model';
import { SyncService } from '../../services/sync.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [FormsModule, CommonModule, CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
})
export class CarListComponent implements OnInit {
  private fuel$ = new BehaviorSubject<string>('');
  private valto$ = new BehaviorSubject<string>('');
  private minSzemelyek$ = new BehaviorSubject<number | null>(null);
  private maxAr$ = new BehaviorSubject<number | null>(null);

  filteredCars$!: Observable<Car[]>;

  constructor(private syncService: SyncService) {}

  ngOnInit(): void {
    this.filteredCars$ = combineLatest([
      this.fuel$,
      this.valto$,
      this.minSzemelyek$,
      this.maxAr$,
      this.syncService.getCars(),
    ]).pipe(
      map(([fuel, valto, minSzemely, maxAr, cars]) =>
        cars.filter(
          (car) =>
            (!fuel || car.uzemanyag === fuel) &&
            (!valto || car.valto === valto) &&
            (!minSzemely || car.szemelyek >= minSzemely) &&
            (!maxAr || car.ar_nap_ft <= maxAr)
        )
      )
    );
  }

  updateFuel(value: string) {
    this.fuel$.next(value);
  }

  updateValto(value: string) {
    this.valto$.next(value);
  }

  updateMinSzemelyek(value: string) {
    const parsed = parseInt(value, 10);
    this.minSzemelyek$.next(isNaN(parsed) ? null : parsed);
  }

  updateMaxAr(value: string) {
    const parsed = parseInt(value, 10);
    this.maxAr$.next(isNaN(parsed) ? null : parsed);
  }
}
