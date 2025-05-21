import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { format, eachDayOfInterval, isAfter } from 'date-fns';

@Component({
  selector: 'app-rental-calendar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './rental-calendar.component.html',
})
export class RentalCalendarComponent implements OnInit {
  @Input() carId!: string;
  @Output() intervalSelected = new EventEmitter<{ start: string; end: string }>();

  foglaltNapok = new Set<string>();
  startDate: string | null = null;
  endDate: string | null = null;

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const rentalsRef = collection(this.firestore, 'rentals');
    const q = query(rentalsRef, where('carId', '==', this.carId));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const { startDate, endDate } = doc.data();
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });
      days.forEach((day) => this.foglaltNapok.add(format(day, 'yyyy-MM-dd')));
    });
  }

  getCurrentMonthDates(): string[] {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
  }

  kattNap(nap: string) {
    if (this.foglaltNapok.has(nap)) return;

    if (!this.startDate || (this.startDate && this.endDate)) {
      // új kiválasztás kezdése
      this.startDate = nap;
      this.endDate = null;
    } else if (!this.endDate) {
      // ha másodszor kattintott, az a végdátum
      if (isAfter(new Date(nap), new Date(this.startDate))) {
        this.endDate = nap;
      } else {
        this.endDate = this.startDate;
        this.startDate = nap;
      }

      // kibocsátjuk az intervallumot
      this.intervalSelected.emit({ start: this.startDate, end: this.endDate });
    }
  }

  napSzine(nap: string): string {
    if (this.foglaltNapok.has(nap)) return 'bg-red-500 text-white';

    if (this.startDate && this.endDate) {
      if (
        new Date(nap) >= new Date(this.startDate) &&
        new Date(nap) <= new Date(this.endDate)
      ) {
        return 'bg-blue-500 text-white';
      }
    } else if (this.startDate === nap) {
      return 'bg-blue-500 text-white';
    }

    return 'bg-green-100 cursor-pointer hover:bg-green-200';
  }
}
