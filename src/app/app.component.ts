import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonApp, IonRouterOutlet, IonContent, IonToolbar, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  @Input() title!:string;
  constructor() {}
}
