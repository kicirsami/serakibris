import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ExitModalPage } from '../../exit-modal/exit-modal.page';  // Bu satırdan emin olun, doğru dosya yolunu kullanın.
import { ModalPagePage } from '../../pages/modal-page/modal-page.page';
import { Platform } from '@ionic/angular'; 
import { UserService } from '../../services/user.service';
import { Storage } from '@ionic/storage-angular';
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
  private isAlertOpen: boolean = false;

  notifications: { type: string, time: Date }[] = [];
  isModalOpen: boolean = false;
  
  audio: HTMLAudioElement;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private platform: Platform,
    private userService: UserService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController,
  ) {

    this.audio = new Audio();
    this.audio.src = '../../assets/audio/error-83494.mp3';
  }

  seralar: any[] = [];

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackButton();
    });
    this.updateDate();
    this.getUserName();
    this.getGreenhouses();
    this.getUserRole();

    // Her 3 saniyede bir seraları güncelle
    this.intervalId = setInterval(() => {
      this.getGreenhouses();
    }, 3000); // 3 saniye
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
      
      // Magnet sensörünün değerini kontrol et
      const magnetValues = this.seralar.map(sera => sera.magnet);
      if (magnetValues.includes(1) && !this.isAlertOpen) {
        // Eğer bir sera arızalıysa ve alert açık değilse
        this.isAlertOpen = true; // Alert'in açık olduğunu işaretleyin
        this.presentErrorAlert();
      }
  
      // Eğer 1 değeri artık yoksa ve alert açık ise
      if (!magnetValues.includes(1) && this.isAlertOpen) {
        this.isAlertOpen = false; // Alert'in kapalı olduğunu işaretleyin
        await this.dismissAlert(); // Alert'i kapatın
      }
  
      return true;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      return null;
    }
  }
  
  async dismissAlert() {
    const topAlert = await this.alertCtrl.getTop(); // En üstteki alert'i al
    if (topAlert) {
      await topAlert.dismiss(); // Alert'i kapat
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Sistem Hatası',
      message: 'Seranız hasar aldı veya beklenmedik bir sorunla karşılaşıldı.',
      buttons: [],
      backdropDismiss: false, // Arka plana tıklanarak kapanmayı engeller
      cssClass: 'custom-alert-overlay' 
    });

    alert.onDidDismiss().then(() => {
      this.audio.pause();
      this.audio.currentTime = 0; // Sesin başa sarılmasını sağlayın
    });

    await alert.present();

    this.playNotificationSound();
  }

  playNotificationSound() {
    // Sesi çal ve döngüyü başlat
    this.audio.loop = true;
    this.audio.play();
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
