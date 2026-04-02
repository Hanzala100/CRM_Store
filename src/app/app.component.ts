import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StoreConfigService } from './services/store-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private storeConfigService: StoreConfigService) {}

  ngOnInit() {
    this.storeConfigService.loadConfig().subscribe();
  }
}