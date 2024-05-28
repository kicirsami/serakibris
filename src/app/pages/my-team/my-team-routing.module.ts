import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTeamPage } from './my-team.page';

const routes: Routes = [
  {
    path: '',
    component: MyTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamPageRoutingModule {}
