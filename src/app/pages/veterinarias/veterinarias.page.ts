 import { Component, OnInit } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonBackButton, IonSpinner, IonIcon, IonLabel, IonChip, IonButton } from '@ionic/angular/standalone';
 import { Veterinaria } from '../../models/veterinaria.model';
 import { VeterinariaService } from '../../services/veterinaria.service';
 
 @Component({
   selector: 'app-veterinarias',
   templateUrl: './veterinarias.page.html',
   styleUrls: ['./veterinarias.page.scss'],
   standalone: true,
   imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonBackButton, IonSpinner, IonIcon, IonLabel, IonChip, IonButton]
 })
 export class VeterinariasPage implements OnInit {
 
   public veterinarias: Veterinaria[] = [];
 
   constructor(private veterinariaService: VeterinariaService) { }
 
   ngOnInit() {
     this.veterinariaService.getVeterinarias().subscribe(data => {
       this.veterinarias = data;
     });
   }
 
 } 
