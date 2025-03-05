import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cours-form.component.html',
  styleUrl: './cours-form.component.css'
})
export class CoursFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() coursAjoute = new EventEmitter<Cours>();

  // Données pour les sélecteurs
  matieres: string[] = ['Mathématiques', 'Physique-Chimie', 'Français', 'Histoire-Géographie', 'SVT', 'Anglais', 'Philosophie'];
  professeurs: { nom: string, specialite: string }[] = [
    { nom: 'Martin Dubois', specialite: 'Mathématiques' },
    { nom: 'Sophie Moreau', specialite: 'Physique-Chimie' },
    { nom: 'Philippe Lambert', specialite: 'Anglais' },
    { nom: 'Claire Fontaine', specialite: 'Français' },
    { nom: 'Thomas Petit', specialite: 'Histoire-Géographie' },
    { nom: 'Marie Leroy', specialite: 'SVT' }
  ];
  
  classes: string[] = ['Terminale S', 'Terminale L', 'Première S', 'Première L', 'Seconde A', 'Seconde B'];
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
