import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { IClasse } from '../../../interfaces/classe.interface';
import { ICours } from '../../../interfaces/cours.interface';

interface Cours {
  id: number;
  titre: string;
  professeur: string; //1
  classe: string; //3
  matiere: string; //4
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: 'Actif' | 'Inactif';
  couleur: string;
}


@Component({
    selector: 'app-cours-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './cours-form.component.html',
    styleUrl: './cours-form.component.css'
})
export class CoursFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() coursAjoute = new EventEmitter<ICours>();
  @Output() getProfesseur = new EventEmitter<string>();
  @Output() getClasse = new EventEmitter<string>();
  @Output() getMatiere = new EventEmitter<string>();
  @Input() matieres: IMatiere[] = [];
  @Input() professeurs: IProfesseur[] = [];
  @Input() classes: IClasse[] = [];

  
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  

  // Données du formulaire
  nouveauCours = {
    titre: '',
    matiere: '',
    professeur: '',
    salle: '',
    classe: '',
    volumeHoraire: 0,
    coefficient: 0,
    anneeAcademique: '',
    statut: '',
  };

  // Couleurs pour les cours
  couleurs: string[] = ['#4A77B4', '#6C5CE7', '#00B894', '#FF7675', '#FDCB6E', '#E84393', '#00CEC9'];

  

  fermer() {
    this.close.emit();
  }

  soumettre() {
    // Générer un ID unique
    const id = Date.now();
    
    // Choisir une couleur aléatoire
    const couleur = this.couleurs[Math.floor(Math.random() * this.couleurs.length)];
    
    
    
    this.fermer();
  }
}
