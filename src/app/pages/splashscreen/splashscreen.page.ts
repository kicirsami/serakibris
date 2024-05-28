import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  isTablet: boolean = false;

  constructor(private platform: Platform, private router: Router) { }

  ngOnInit() {
    // Kullanıcı daha önce giriş yapmışsa, doğrudan login sayfasına yönlendir
    if (localStorage.getItem('isLoggedIn')) {
      this.redirectToLogin();
    } else {
      // Kullanıcı daha önce giriş yapmamışsa, isLoggedIn işaretçisini oluştur
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    this.isTablet = this.platform.is('tablet');
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }
}
