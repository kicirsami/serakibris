import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // Storage değişkeni için tanımlama
  storage: Storage;
  userName: string = '';
  role: string = '';
  image_path: string = '';
  userInfo: any ;
  private readonly tawkChatLink: string = 'https://tawk.to/chat/6639e62807f59932ab3cd94b/1ht92m3h1';

  constructor(
    private router: Router, 
    private storageService: Storage, 
    private http: HttpClient,
    private userService: UserService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) 
    {
    this.storage = storageService;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  goToMyTeam() {
    this.router.navigateByUrl('/my-team');
  }
  goToMyProfile() {
    this.router.navigateByUrl('/my-profile');
  }
  async getUserInfo() { 
    this.userInfo = await this.userService.getUserInfo();
    if(this.userInfo){

      this.userInfo.img = this.userInfo.image_path;
      this.userName = this.userInfo.fullname;
      const roleId = this.userInfo.role_id; 
      if (roleId === 1) {
        this.role = 'Yönetici';
      } else if (roleId === 2) {
        this.role = 'Çalışan';
      }

      
    }
  }


  logout() {
    // Çıkış işlemleri: Token'i kaldır
    this.storage.remove('token').then(() => {
      console.log('Çıkış yapıldı.');
      this.router.navigate(['/login']); // Çıkış yapıldıktan sonra login sayfasına yönlendir
    });
  }

  async onClickChat() {
    if (navigator.onLine) {
      const browser = window.open(this.tawkChatLink, '_self', 'location=no');
    } else {
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error Internet Connection',
      message: 'There is no internet connection. Please check your connection.',
      buttons: ['OK']
    });
    await alert.present();
  }

  getTeamButtonLabel(): string {
    return this.userInfo && this.userInfo.role_id === 1 ? 'Ekibim' : 'Ekip Arkadaşlarım';
  }

  async addWorker() {
    if (this.userInfo.role_id === 2) { // Eğer kullanıcı bir çalışansa
      const toast = await this.toastController.create({
        message: 'Yetki seviyeniz buraya girmenize izin vermiyor.',
        duration: 2000,
        position: 'top',
        cssClass: 'toast-custom-class'

      });
      await toast.present();
    } else {
      this.router.navigateByUrl('/register'); // Kullanıcı yönetici ise /register sayfasına yönlendir
    }
  }
}
