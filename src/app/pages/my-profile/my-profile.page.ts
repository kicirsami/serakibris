import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  userInfo: any;

  user: any = {
    fullName: '',
    phone: '',
    email: '',
    password: '',
    role_id: '',
    imagePath: ''
  };

  originalRoleId: number | undefined;
  selectedPhoto: any;
  selectedFile: File | null = null;

  constructor(
    private router: Router, 
    private userService: UserService, 
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  async getUserProfile() {
    try {
      const userInfo = await this.userService.getUserInfo();
      if (userInfo) {
        this.user = {
          id: userInfo.id,
          fullname: userInfo.fullname,
          phone: userInfo.phone,
          email: userInfo.email,
          role_id: userInfo.role_id,
          img: userInfo.image_path
        };
        this.originalRoleId = userInfo.role_id; // Orijinal rolü sakla
      }
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  }

  roles = [
    { id: 1, name: 'Yönetici' },
    { id: 2, name: 'Çalışan' }
  ];

  async onSubmit() {
    try {
      // Kullanıcı rolünü kontrol et
      if (this.originalRoleId === 2 && this.user.role_id !== 2) {
        // Eğer kullanıcı "Çalışan" ise ve rolünü değiştirmeye çalışıyorsa işlemi engelle
        const toast = await this.toastController.create({
          message: 'Yetkiniz kullanıcı türünü değiştirmeye yetmiyor.',
          duration: 2000,
          position: 'top',
          cssClass: 'toast-custom-class'
        });
        await toast.present();
        this.user.role_id = this.originalRoleId; // Rolü orijinal haline döndür
        return; 
      }

      if (this.selectedFile) {
        const uploadResponse = await this.userService.uploadProfileImage(this.user, this.selectedFile);
        this.user.imagePath = uploadResponse.filePath;
      }
      
      await this.userService.updateUserInfo(this.user);
      console.log(this.user);

      const toast = await this.toastController.create({
        message: 'Profil başarıyla güncellendi.',
        duration: 1000,
        position: 'top',
        cssClass: 'toast-custom-class'
      });
      await toast.present();

      setTimeout(() => {
        this.router.navigate(['/profile']).then(() => {
          location.reload();
        });
      }, 2000);
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const icon = document.querySelector(".toggle-password") as HTMLElement;
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.setAttribute("name", "eye-off");
    } else {
      passwordInput.type = "password";
      icon.setAttribute("name", "eye");
    }
  }

  openFileInput() {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedPhoto = reader.result;
      };
    }
  }

  getProfileImage(): string {
    if (this.user.role_id === 1) {
      return 'assets/image/executive.jpg'; // Yönetici için varsayılan profil resmi
    } else if (this.user.role_id === 2) {
      return 'assets/image/worker.png'; // Çalışan için varsayılan profil resmi
    } else {
      return ''; 
    }
  }
}
