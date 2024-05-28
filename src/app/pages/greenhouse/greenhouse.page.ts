import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-greenhouse',
  templateUrl: './greenhouse.page.html',
  styleUrls: ['./greenhouse.page.scss'],
})
export class GreenhousePage implements OnInit, OnDestroy {
  isToggleOnWater: boolean = false;
  isToggleOnFan: boolean = false;
  isToggleOnIsik: boolean = false;
  private readonly tawkChatLink: string = 'https://tawk.to/chat/6639e62807f59932ab3cd94b/1ht92m3h1';

  private state: { id: string, name: string, photo: string } | null = null; 
  sera: any = null;
  seraName: string = '';
  role_id: number = 0;
  private intervalId: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,  
    private route: ActivatedRoute,
    private alertController: AlertController,
    private http: HttpClient,
    private storage: Storage,
    private toastController: ToastController,
    private userService: UserService,
    
  ) { 
    this.storage.create();
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.state = navigation.extras.state as {
        id: string,
        name: string,
        photo: string
      };
    }
  }

  ngOnInit() {
    if (this.state) {
      this.sera = {
        id: this.state.id,
        name: this.state.name,
        photo: this.state.photo
      };

      this.seraName = this.sera.name;
    }

    this.getGreenhouse(this.sera);

    // Her 5 saniyede bir sensör verilerini güncelle
    this.intervalId = setInterval(() => {
      this.getGreenhouse(this.sera);
    }, 3000); // 5 saniye
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }

  updateHeaderTitle(name: string) {
    const headerTitleElement = document.querySelector('.toolbar-title');
    if (headerTitleElement) {
      headerTitleElement.textContent = name;
    }
  }

  toggleChangedWater() {
    this.isToggleOnWater = !this.isToggleOnWater; // Durumu tersine çevir
  const command = this.isToggleOnWater ? 'water_on' : 'water_off'; // Su motorunu açma veya kapatma komutunu belirleyin
  this.sendCommandToArduino(command);
  }
  toggleChangedFan() {
    this.isToggleOnFan = !this.isToggleOnFan; // Durumu tersine çevir
  const command = this.isToggleOnFan ? 'fan_on' : 'fan_off'; // Fanı açma veya kapatma komutunu belirleyin
  this.sendCommandToArduino(command);
  }
  toggleChangedIsik() {
    this.isToggleOnIsik = !this.isToggleOnIsik; // Durumu tersine çevir
    const command = this.isToggleOnIsik ? 'isik_on' : 'isik_off'; // Işık açma veya kapatma komutunu belirleyin
    this.sendCommandToArduino(command);
  }
  

  sendCommandToArduino(command: string) {
    this.http.get(`http://localhost:3000/arduino?command=${command}`).subscribe(response => {
      console.log('Arduino response:', response); // Arduino'dan gelen yanıtı konsola yazdır
    }, error => {
      console.error('Error sending command to Arduino:', error); // Hata durumunda konsola yazdır
    });
  }

  goToProfile() {
    this.router.navigateByUrl('/profile'); 
  }

  async onClickChat() {
    if (navigator.onLine) {
      const browser = window.open(this.tawkChatLink, '_self', 'location=no');
    } else {
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error Internet Connection',
      message: 'There is no internet connection. Please check your connection.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showDeleteConfirmation(sera: any) {
    try {
      // Burada giriş yapan kullanıcının rolünü alın
      const userInfo = await this.userService.getUserInfo();
      const role_id = userInfo.role_id;
  
      // Eğer kullanıcı yönetici ise
      if (role_id === 1) {
        const alert = await this.alertController.create({
          header: 'Sera silme işlemini gerçekleştirmek üzeresiniz',
          message: 'Devam etmek istediğinizden emin misiniz?',
          buttons: [
            {
              text: 'Hayır',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Silme işlemi iptal edildi');
              }
            }, {
              text: 'Evet',
              handler: async () => {
                console.log('Silme işlemi gerçekleştirildi');
                try {
                  await this.deleteSera(this.sera);
                  this.router.navigateByUrl('/home').then(async () => {
                    await this.presentToast('Sera başarıyla silindi');
                    window.location.reload();
                  });
                } catch (error) {
                  console.error('Sera silinirken bir hata oluştu:', error);
                }
              }
            }
          ]
        });
  
        await alert.present();
      } else {
        // Eğer kullanıcı yönetici değilse, toast mesajı göster
        await this.presentToast('Sera silme işlemi sadece yöneticiler tarafından gerçekleştirilebilir.');
      }
    } catch (error) {
      console.error('Sera silme işlemi sırasında bir hata oluştu:', error);
    }
  }

  async deleteSera(sera: any) {
    console.log("silme işlemi");
    console.log("Silinecek sera:", sera);

    let url = `http://localhost:3000/greenhouse/${sera.id}`;
   try {
    // Silme isteğini gönder
    let resp: any = await this.http.delete(url).toPromise();
    if(resp['succuess']) {
      await this.presentToast('Sera başarıyla silindi');
      this.router.navigateByUrl('/home').then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error('Sera silinirken bir hata oluştu:', error);
  }
  
  }

  async getGreenhouse(sera: any) {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      let url = `http://localhost:3000/greenhouse/${sera.id}`;
      this.sera = await this.http.get(url, { headers }).toPromise();

      this.isToggleOnIsik = this.sera.light === 1;
      this.isToggleOnFan = this.sera.fan === 1;
      this.isToggleOnWater = this.sera.water_motor === 1;
      
      return true
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      return null;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-custom-class'
    });
    await toast.present();
  }
}

