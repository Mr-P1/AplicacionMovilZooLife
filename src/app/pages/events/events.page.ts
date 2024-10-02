import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonicModule, IonToolbar, CommonModule, FormsModule]
})
export class EventsPage implements OnInit {

  constructor() {}


  ngOnInit(): void {
  }
}
