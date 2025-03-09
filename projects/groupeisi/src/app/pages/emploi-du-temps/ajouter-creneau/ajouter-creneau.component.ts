import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICours } from '../../../interfaces/cours.interface';
import { IDescription } from '../../../interfaces/description.interface';
import { ICreneau } from '../../../interfaces/creneau.interface';
import { CoursService } from '../../../services/cours/cours.service';

@Component({
  selector: 'app-ajouter-creneau',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-creneau.component.html',
  styleUrl: './ajouter-creneau.component.css'
})
export class AjouterCreneauComponent {
  @Output() close = new EventEmitter<void>();
  @Output() creneauAjoute = new EventEmitter<ICreneau>();

  salles: string[] = ['A101', 'A102', 'B201', 'B202', 'C103', 'C104', 'D105'];
  cours: ICours[] = [];

  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Données du formulaire
  nouveauCreneau = {
    cour: '',
    descriptions: [this.creerDescriptionVide()],
  };



  constructor(
    private coursService: CoursService
  ) {
    this.getCours();
  }

  getCours(): void {
    this.coursService.getAllCours().subscribe(
      (data) => {
        this.cours = data;
        // Si des cours sont disponibles, initialise le premier cours
        if (this.cours.length > 0) {
          this.nouveauCreneau.cour = this.cours[0].id || '';
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des cours', error);
      }
    );
  }

  creerDescriptionVide(): IDescription {
    return {
      dateCours: new Date(0),
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
    // Générer un ID unique pour chaque créneau
    const id = Date.now();

    // Créer un créneau pour chaque description
    this.nouveauCreneau.descriptions.forEach(desc => {
      const nouveauCreneau: ICreneau = {
        id: id.toString(),  // Utilisation de l'ID unique généré
        coursId: this.nouveauCreneau.cour,
        descriptions: [desc],
      };

      // Emission de l'événement avec le créneau ajouté
      this.creneauAjoute.emit(nouveauCreneau);
      window.location.reload();
    });

    this.fermer();
  }
}
