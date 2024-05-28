import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.page.html',
  styleUrls: ['./my-team.page.scss'],
})
export class MyTeamPage implements OnInit {
  userInfo: any;
  teamMembers: any[] = [];
  managerName: string = '';
  role_id!: number;
  

  constructor(private userService: UserService, private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      this.userInfo = await this.userService.getUserInfo();
      if (this.userInfo && this.userInfo.id) {
        this.role_id = this.userInfo.role_id;
        console.log('User info:', this.userInfo);
        if (this.role_id === 2) { // Çalışan ise
          await this.getManagerName(this.userInfo.id);
        }
        await this.loadTeamMembers(this.userInfo.id);
      } else {
        console.error('User info is not available.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async loadTeamMembers(userId: number) {
    try {
      const teamMembersResponse = await this.userService.getTeamMembers(userId);
      this.teamMembers = teamMembersResponse;
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }

  async getManagerName(userId: number) {
    try {
      const managerInfo = await this.userService.getManagerInfo(userId);
      this.managerName = managerInfo.fullname;
    } catch (error) {
      console.error('Error fetching manager info:', error);
    }
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1:
        return 'Yönetici';
      case 2:
        return 'Çalışan';
      default:
        return 'Bilinmeyen';
    }
  }
}
