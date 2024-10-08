import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-info-zoo',
  templateUrl: './info-zoo.page.html',
  styleUrls: ['./info-zoo.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class InfoZooPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
