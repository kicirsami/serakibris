import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss']
})
export class RegisterPage {

  userData = {
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: '',
    img:'',
    role_id: 0
  };

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastController: ToastController,
    private storage: Storage,
  ) {}

  async onSubmit() {
    if (!this.isFormValid()) {
      this.presentToast('Lütfen tüm alanları doldurun ve doğru formatta bilgi girin.');
      return;
    }
    const token = await this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.http.post('http://localhost:3000/register', this.userData,{ headers })
      .subscribe((response) => {
        console.log('Kullanıcı başarıyla kaydedildi', response);
        this.presentToast('Kullanıcı başarıyla kaydedildi');
        this.navCtrl.navigateForward('/home');
      }, (error) => {
        console.error('Kullanıcı kaydedilirken hata oluştu', error);
        this.presentToast('Kullanıcı kaydedilirken bir hata oluştu');
      });
  }

  isFormValid(): boolean {
    return (
      this.userData.username !== '' &&
      this.userData.password !== '' &&
      this.userData.fullname !== '' &&
      this.isPhoneValid() &&
      this.isEmailValid() &&
      this.userData.role_id !== 0
    );
  }

  isPhoneValid(): boolean {
    const phonePattern = /[0-9]{4}[0-9]{3}[0-9]{4}/;
    return phonePattern.test(this.userData.phone);
  }

  isEmailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.userData.email);
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post('http://localhost:3000/upload', formData)
      .subscribe(response => {
        console.log('Dosya yüklendi', response);
        this.presentToast('Fotoğraf başarıyla yüklendi');
        this.userData.img = (response as any)['imagePath'];
      }, (error) => {
        console.error('Dosya yüklenirken bir hata oluştu', error);
        this.presentToast('Dosya yüklenirken bir hata oluştu');
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-custom-class'
    });
    toast.present();
  }
}
