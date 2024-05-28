import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.storage.create().then(() => {
        this.storage?.get('token').then((token) => {
          if (token) {
            // Oturum açık ise, sayfaya izin ver
            resolve(true);
          } else {
            // Oturum kapalı ise, giriş sayfasına yönlendir
            this.router.navigate(['/login']);
            resolve(false);
          }
        }).catch((error) => {
          // Hata durumunda da giriş sayfasına yönlendir ve hatayı konsola yazdır
          console.error('Token alınırken hata oluştu:', error);
          this.router.navigate(['/login']);
          resolve(false);
        });
      });
      
    });
  }
}
