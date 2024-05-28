import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GreenhouseService {
  private isToggleOnWaterSource = new BehaviorSubject<boolean>(false);
  isToggleOnWater$ = this.isToggleOnWaterSource.asObservable();

  private isToggleOnFanSource = new BehaviorSubject<boolean>(false);
  isToggleOnFan$ = this.isToggleOnFanSource.asObservable();

  private isToggleOnIsikSource = new BehaviorSubject<boolean>(false);
  isToggleOnIsik$ = this.isToggleOnIsikSource.asObservable();

  constructor() { }

  setToggleOnWater(isToggleOnWater: boolean) {
    this.isToggleOnWaterSource.next(isToggleOnWater);
  }

  setToggleOnFan(isToggleOnFan: boolean) {
    this.isToggleOnFanSource.next(isToggleOnFan);
  }

  setToggleOnIsik(isToggleOnIsik: boolean) {
    this.isToggleOnIsikSource.next(isToggleOnIsik);
  }
}
