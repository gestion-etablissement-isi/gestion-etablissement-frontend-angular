import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesseurDetailsComponent } from '../professeur-details/professeur-details.component';
import { ProfesseurFormComponent } from '../professeur-form/professeur-form.component';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { MatiereService } from '../../../services/matiere/matiere.service';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-accueil-professeurs',
    imports: [CommonModule, FormsModule, ProfesseurDetailsComponent, ProfesseurFormComponent],
    templateUrl: './accueil-professeurs.component.html',
    styleUrl: './accueil-professeurs.component.css'
})
export class AccueilProfesseursComponent {
  professeurs: IProfesseur[] = [];
  filteredProfesseurs: IProfesseur[] = [];
  selectedProfesseur: IProfesseur | null = null;
  professeur: IProfesseur = {nom: '', prenom: '', email: '', matiere: '', statut: ''};
  
  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  // Filtres
  filtreMatiere: string = '';
  filtreStatut: string = '';
  
  // Options pour les filtres
  matieres: IMatiere[] = [];
  statuts: string[] = ['Actif', 'Inactif'];

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.getProfesseurs();
    this.loadMatiere();
  }
  constructor(
    private matiereService: MatiereService,
    private professeurService: ProfesseurService
    ) {}

    getMatiere(matiereId: string): Observable<string> {
      return this.matiereService.consulterMatiere(matiereId).pipe(
        map((matiere) => matiere ? matiere.libelle : 'Matière introuvable')
      );
    }
  
    loadMatiere() {
    this.matiereService.getAllMatieres().subscribe(
      (data) => {
        this.matieres = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des matieres', error);
      }
    );
    }

  // Méthode pour récupérer tous les professeurs
  getProfesseurs(): void {
    this.professeurService.getAllProfesseurs().subscribe(
      (data) => {
        this.professeurs = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des professeurs', error);
      }
    );
  }

  applyFilters() {
    this.filteredProfesseurs = this.professeurs.filter(professeur => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        professeur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professeur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professeur.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtres par catégorie
      const matiereMatch = !this.filtreMatiere || professeur.matiere === this.filtreMatiere;
      const statutMatch = !this.filtreStatut || professeur.statut === this.filtreStatut;
      
      return searchMatch && matiereMatch && statutMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreMatiere = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  showProfesseurDetails(professeur: IProfesseur) {
    this.selectedProfesseur = professeur;
    this.showDetails = true;
    this.showAddForm = false;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedProfesseur = null;
  }

  openAddForm() {
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedProfesseur = null;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  ajouterProfesseur(): void {
    this.professeurService.ajouterProfesseur(this.professeur).subscribe(
      (data) => {
        this.professeurs.push(data);
        console.log('Professeur ajoutée avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout du professeur", error);
      }
    );
  }

  // Méthode pour supprimer une professeur
  supprimerProfesseur(id: string): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer le professeur  ?`)
    ) {
      this.professeurService.supprimerProfesseur(id).subscribe(
        () => {
          this.professeurs = this.professeurs.filter((professeur) => professeur.id !== id); // Supprimer la matiere de la liste
          console.log('Professeur supprimée avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du professeur', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'une professeur
  consulterProfesseur(id: string): void {
    this.professeurService.consulterProfesseur(id).subscribe(
      (data) => {
        this.professeur = data; 
        console.log('Professeur consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation de la professeur', error);
      }
    );
  }

  // Méthode pour mettre à jour une professeur
  updateProfesseur(): void {
    this.professeurService.updateProfesseur(this.professeur).subscribe(
      (data) => {
        
        const index = this.professeurs.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.professeurs[index] = data;
        }
        console.log('Professeur mise à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la professeur', error);
      }
    );
  }
}
