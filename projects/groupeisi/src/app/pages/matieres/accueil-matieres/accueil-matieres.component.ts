import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatiereFormComponent } from '../matiere-form/matiere-form.component';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { MatiereService } from '../../../services/matiere/matiere.service';

@Component({
    selector: 'app-accueil-matieres',
    imports: [CommonModule, FormsModule, MatiereFormComponent],
    templateUrl: './accueil-matieres.component.html',
    styleUrl: './accueil-matieres.component.css'
})
export class AccueilMatieresComponent implements OnInit {
  matieres: IMatiere[] = [];
  matiere: IMatiere = {libelle: '', statut: ''}
  filteredMatieres: IMatiere[] = [];
  selectedMatiere: IMatiere | null = null;
  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.getMatieres();
  }

  constructor(private matiereService: MatiereService) {}

  // Méthode pour récupérer toutes les matieres
  getMatieres(): void {
    this.matiereService.getAllMatieres().subscribe(
      (data) => {
        this.matieres = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des matieres', error);
      }
    );
  }

  applyFilters() {
    this.filteredMatieres = this.matieres.filter((matiere) => {
      // Recherche textuelle sur le nom
      const searchMatch =
        !this.searchTerm ||
        matiere.libelle.toLowerCase().includes(this.searchTerm.toLowerCase());

      return searchMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.applyFilters();
  }

  


  openAddForm() {
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedMatiere = null;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  // Méthode pour ajouter une matiere
  ajouterMatiere(): void {
    this.matiereService.ajouterMatiere(this.matiere).subscribe(
      (data) => {
        this.matieres.push(data);
        console.log('Matiere ajoutée avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la matiere", error);
      }
    );
  }

  // Méthode pour supprimer une matiere
  supprimerMatiere(id: string): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la matiere ?`)
    ) {
      this.matiereService.supprimerMatiere(id).subscribe(
        () => {
          this.matieres = this.matieres.filter((matiere) => matiere.id !== id); // Supprimer la matiere de la liste
          console.log('Matiere supprimée avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression de la matiere', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'une matiere
  consulterMatiere(id: string): void {
    this.matiereService.consulterMatiere(id).subscribe(
      (data) => {
        this.matiere = data; 
        console.log('Matiere consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation de la matiere', error);
      }
    );
  }

  // Méthode pour mettre à jour une matiere
  updateMatiere(): void {
    this.matiereService.updateMatiere(this.matiere).subscribe(
      (data) => {
        
        const index = this.matieres.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.matieres[index] = data;
        }
        console.log('Matiere mise à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la matiere', error);
      }
    );
  }

  
}
