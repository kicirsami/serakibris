import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GreenhousePage } from './greenhouse.page';

const routes: Routes = [
  {
    path: '',
    component: GreenhousePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenhousePageRoutingModule {}
