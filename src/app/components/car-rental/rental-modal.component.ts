import { Component, Input } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RentalCalendarComponent } from '../rental-calendar/rental-calendar.component';
import { Car } from '../../models/car.model';
import { ConsumptionUnitPipe } from '../../pipes/consumption.pipe';

@Component({
  selector: 'app-rental-modal',
  templateUrl: './rental-modal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RentalCalendarComponent,
    ConsumptionUnitPipe,
  ],
})
export class RentalModalComponent {
  @Input() car!: Car;
  @Input() carId!: string;

  isOpen = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rentalService: RentalService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }

  async submitRental() {
    const { startDate, endDate } = this.form.value;
    const user = this.authService.getCurrentUser();
    if (!user) return;

    console.log(this.carId, startDate, endDate);
    if (!this.carId || !startDate || !endDate) {
      alert('Hiányzó autóazonosító vagy dátum!');
      return;
    }

    // ⛔ Dátumellenőrzés – ne legyen üres
    if (!startDate || !endDate) {
      alert('Kérlek, add meg a kezdő- és a befejező dátumot!');
      return;
    }

    const isAvailable = await this.rentalService.isCarAvailable(
      this.carId,
      startDate,
      endDate
    );

    if (!isAvailable) {
      alert('Ez az időpont már foglalt.');
      return;
    }

    await this.rentalService.rentCar(this.carId, user.uid, startDate, endDate);
    alert('Bérlés sikeres!');
    this.close();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.form.reset();
  }
}
