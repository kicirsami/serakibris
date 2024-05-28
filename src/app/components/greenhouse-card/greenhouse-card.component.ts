import {  OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Router,
  NavigationExtras
} from '@angular/router';

@Component({
  selector: 'app-greenhouse-card',
  templateUrl: './greenhouse-card.component.html',
  styleUrls: ['./greenhouse-card.component.scss'],
})
export class GreenhouseCardComponent implements OnInit {

  @Input() sera: any;
 
  navigationExtras: NavigationExtras;

  constructor(public alertController: AlertController, private router: Router, private http: HttpClient) {
    this.navigationExtras = {
      state: {
        id: this.sera ? this.sera['id'] : null,
        name: this.sera ? this.sera['name'] : null,
        photo: this.sera ? this.sera['photo'] : null
      }
    };
  }
  
  ngOnInit() {}

}
