import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string = '';
  password: string = '';
  hataMesaji: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private http: HttpClient
  ) { }

  ionViewWillEnter() {
    this.storage.create().then(() => {
      this.storage.get('token').then((token) => {
        if (token) {
          this.router.navigate(['/home']);
        }
      });
    }).catch((error) => {
      console.error('Veritabanı oluşturma hatası:', error);
    });
  }

  girisYap() {
    // Kullanıcı adı kontrolü
    if (!this.username) {
      this.hataMesaji = 'Kullanıcı adı boş bırakılamaz.';
      return;
    }
  
    // Şifre kontrolü
    if (!this.password) {
      this.hataMesaji = 'Şifre boş bırakılamaz.';
      return;
    }

    this.http.post<any>('http://localhost:3000/login', { 
        username: this.username, 
        password: this.password
      })
      .subscribe({
        next: (data) => {
          const token = data.token;
          
          this.storage.set('token', token).then(() => {
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            })
            
          });
        },
        error: (error) => {
          if (error.status === 0) {
            this.hataMesaji = 'Sunucuya bağlanırken hata oluştu!';
          } else {
            this.hataMesaji = 'Kullanıcı adı veya şifre hatalı.';
          }
        }
      });
  }

  logout() {
    // Çıkış işlemleri: Token'i kaldır
    this.storage.remove('token').then(() => {
      console.log('Çıkış yapıldı.');
    });
  }
}
