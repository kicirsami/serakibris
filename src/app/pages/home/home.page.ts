import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ExitModalPage } from '../../exit-modal/exit-modal.page';
import { ModalPagePage } from '../../pages/modal-page/modal-page.page';
import { Platform } from '@ionic/angular'; 
import { UserService } from '../../services/user.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  seraName: string = '';
  private isExitModalOpen: boolean = false;
  currentDate: string = '';
  userName: string = '';
  private readonly tawkChatLink: string = 'https://tawk.to/chat/6639e62807f59932ab3cd94b/1ht92m3h1';
  role_id: number = 0;
  private intervalId: any;

  notifications: { type: string, time: Date }[] = [];
  isModalOpen: boolean = false;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private platform: Platform,
    private userService: UserService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  seralar: any[] = [];

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackButton();
    });
    this.updateDate();
    this.getUserName();
    this.getGreenhouses();
    this.getUserRole();

    // Her 5 saniyede bir seraları güncelle
    this.intervalId = setInterval(() => {
      this.getGreenhouses();
    }, 3000); // 5 saniye
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async handleBackButton() {
    console.log('Geri tuşuna basıldı.');
    if (!this.isExitModalOpen) {
      await this.presentExitConfirmationModal();
    }
  }

  async presentExitConfirmationModal() {
    this.isExitModalOpen = true;
    const modal = await this.modalController.create({
      component: ExitModalPage,
      cssClass: 'my-custom-class',
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(() => {
      this.isExitModalOpen = false;
    });

    await modal.present();
  }

  async openSeraEkleModal() {
    if (this.role_id === 1) {
      // Yönetici ise sera ekleme modalını aç
      const modal = await this.modalController.create({
        component: ModalPagePage,
        cssClass: 'add-button',
      });

      modal.onDidDismiss().then((data) => {
        if (data.data) {
          this.addSera(data.data);
        }
      });
      await modal.present();
    } else {
      // Diğer durumlar için yetki seviyesi yetersiz uyarısı göster
      this.presentToast('Yetki seviyeniz bu işlem için yetersiz.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-custom-class'
    });
    toast.present();
  }

  addSera(sera: any) {
    const newId = this.seralar.length ? Math.max(...this.seralar.map(s => s.id)) + 1 : 1;
    sera.id = newId;
    this.seralar.push(sera);
  }

  removeSera(seraId: number) {
    this.seralar = this.seralar.filter(sera => sera.id !== seraId);
  }

  redirectToSeraEkle() {
    this.router.navigateByUrl('/sera-ekle');
  }

  goToGreenhouse(id: number=0, name: string, photo: string) {
    this.router.navigateByUrl('/greenhouse', { state: { id: id } }); 
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  updateDate() {
    var today = new Date();
    var days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    var formattedDate = days[today.getDay()] + ", " + today.getDate() + " " + this.getMonthName(today.getMonth()) + " " + today.getFullYear();
    this.currentDate = formattedDate;
  }

  getMonthName(month: number) {
    var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return months[month];
  }

  async getUserName() {
    let data = await this.userService.getUserInfo();
    this.userName = data['fullname']; 
    console.log(this.userService);
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

  async getGreenhouses() {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.seralar = await this.http.get<any>('http://localhost:3000/greenhouse', { headers }).toPromise();
      return true;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      return null;
    }
  }

  async showSuccessMessage() {
    const alert = await this.alertCtrl.create({
      header: 'Seranız başarıyla silindi!',
      buttons: ['Tamam']
    });

    await alert.present();
  }

  async getUserRole() {
    try {
      const userInfo = await this.userService.getUserInfo();
      this.role_id = userInfo.role_id; // Kullanıcının rolünü al
    } catch (error) {
      console.error('Kullanıcı rolü alınamadı:', error);
    }
  }


  getUnreadCount() {
    return this.notifications.length;
  }

  openNotificationModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}