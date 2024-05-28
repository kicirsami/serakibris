import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExitModalPageRoutingModule } from './exit-modal-routing.module';

import { ExitModalPage } from './exit-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExitModalPageRoutingModule
  ],
  declarations: [ExitModalPage]
})
export class ExitModalPageModule {}
