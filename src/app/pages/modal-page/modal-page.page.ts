import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {
  id: string = '';
  name: string = '';
  img: string = '';
  site_id: string = '';
  selectedPhoto: any;

  constructor(private modalController: ModalController, private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }


  addOrUpdateGreenhouse(data: any) {
    return this.http.post('http://localhost:3000/greenhouse', data); 
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addSera() {
    const data = {
      id: this.id,
      name: this.name,
      img: this.img,
      site_id: this.site_id,
    };

    this.addOrUpdateGreenhouse(data).subscribe(
      (response) => {
        console.log("sera endpointi başladı");
        
        console.log(response); // Başarılı yanıtı kontrol et
        this.dismissModal();
        this.router.navigateByUrl('/home').then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error); // Hata durumunda kontrol et
        // Hata mesajını kullanıcıya gösterme veya başka bir işlem yapma
      }
    );
  }

  
  openFileInput() {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedPhoto = reader.result;
      };
    }
  }
}

