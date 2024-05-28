import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExitModalPage } from './exit-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ExitModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExitModalPageRoutingModule {}
