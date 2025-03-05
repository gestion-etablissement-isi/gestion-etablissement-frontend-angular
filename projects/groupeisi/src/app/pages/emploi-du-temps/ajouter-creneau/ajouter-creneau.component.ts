import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cours {
  id: number;
  titre: string;
  professeur: string;
  classe: string;
  matiere: string;
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: string;
}

interface Creneau {
  id: number;
  cours: Cours;
  descriptions: CreneauDescription[];
  couleur: string;
}

interface CreneauDescription {
  date: string;
  salle: string;
  description: string;
  heureDebut: string;
  heureFin: string;
}

@Component({
  selector: 'app-ajouter-creneau',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-creneau.component.html',
  styleUrl: './ajouter-creneau.component.css'
})
export class AjouterCreneauComponent {
  @Output() close = new EventEmitter<void>();
  @Output() creneauAjoute = new EventEmitter<Creneau>();

  salles: string[] = ['A101', 'A102', 'B201', 'B202', 'C103', 'C104', 'D105'];
  cours = [
    {
      id: 1,
      titre: "Algèbre Linéaire",
      professeur: "M. Diallo",
      classe: "Licence 1 GL",
      matiere: "Mathématiques",
      volumeHoraire: 30,
      coefficient: 4,
      anneeAcademique: "2024-2025",
      statut: 'Actif'
    },
    {
      id: 2,
      titre: "Programmation Orientée Objet",
      professeur: "Mme Ndiaye",
      classe: "Licence 2 GL",
      matiere: "Informatique",
      volumeHoraire: 40,
      coefficient: 5,
      anneeAcademique: "2024-2025",
      statut: 'Inactif'
    },
    {
      id: 3,
      titre: "Réseaux et Protocoles",
      professeur: "M. Sow",
      classe: "Licence 3 GL",
      matiere: "Systèmes Réseaux",
      volumeHoraire: 35,
      coefficient: 3,
      anneeAcademique: "2024-2025",
      statut: 'Actif'
    }
  ];
  
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  
  // Données du formulaire
  nouveauCreneau = {
    id: 0,
    cours: this.cours[0],
    descriptions: [this.creerDescriptionVide()]
  };

  // Couleurs pour les creneau
  couleurs: string[] = ['#4A77B4', '#6C5CE7', '#00B894', '#FF7675', '#FDCB6E', '#E84393', '#00CEC9'];

  creerDescriptionVide(): CreneauDescription {
    return {
      date: '',
      salle: '',
      description: '',
      heureDebut: '',
      heureFin: '',
    };
  }

  ajouterDescription() {
    this.nouveauCreneau.descriptions.push(this.creerDescriptionVide());
  }

  supprimerDescription(index: number) {
    if (this.nouveauCreneau.descriptions.length > 1) {
      this.nouveauCreneau.descriptions.splice(index, 1);
    }
  }

  fermer() {
    this.close.emit();
  }

  soumettre() {
    // Générer un ID unique
    const id = Date.now();
    
    // Choisir une couleur aléatoire
    const couleur = this.couleurs[Math.floor(Math.random() * this.couleurs.length)];
    
    // Créer un creneau pour chaque description
    this.nouveauCreneau.descriptions.forEach(desc => {
      const nouveauCreneau: Creneau = {
        id: id,
        cours: this.nouveauCreneau.cours,
        descriptions: [desc],
        couleur: couleur
      };
      
      this.creneauAjoute.emit(nouveauCreneau);
    });
    
    this.fermer();
  }
}