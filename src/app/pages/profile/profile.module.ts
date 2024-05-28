import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';


@NgModule({
  imports: [
    CommonModule,
    ProfilePageRoutingModule,
    
  ],
  declarations: [
    ProfilePage,
  ]
})
export class ProfilePageModule {}