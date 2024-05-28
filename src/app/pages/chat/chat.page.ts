import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  messages: { text: string, type: string }[] = []; // Mesajları tutmak için dizi
  newMessage: string = ''; // Yeni mesajın girildiği alan

  constructor() {}

  // Mesaj gönderme işlemi
  sendMessage() {
    if (this.newMessage.trim() !== '') { // Boş mesaj gönderilmemesini kontrol et
      this.messages.push({ text: this.newMessage, type: 'outgoing' }); // Giden mesajı listeye ekle
      this.newMessage = ''; // Yeni mesajı temizle
    }
  }

}
