// src/app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, homeOutline, pawOutline, medkitOutline, pricetagOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuth: boolean = false;

  constructor() {
    addIcons({ logOutOutline, personCircleOutline, homeOutline, pawOutline, medkitOutline, pricetagOutline, logInOutline });
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(authState => {
      this.isAuth = authState;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}