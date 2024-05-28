import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-exit-modal',
  templateUrl: './exit-modal.page.html',
  styleUrls: ['./exit-modal.page.scss'],
})
export class ExitModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  // Çıkış onayını işle
  confirmExit(confirm: boolean) {
    // Modalı kapat
    this.modalController.dismiss(confirm);
  }

}
