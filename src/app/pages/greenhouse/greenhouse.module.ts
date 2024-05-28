import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GreenhousePageRoutingModule } from './greenhouse-routing.module';

import { GreenhousePage } from './greenhouse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GreenhousePageRoutingModule
  ],
  declarations: [GreenhousePage]
})
export class GreenhousePageModule {}
