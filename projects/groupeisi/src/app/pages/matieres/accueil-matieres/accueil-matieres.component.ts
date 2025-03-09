import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatiereFormComponent } from '../matiere-form/matiere-form.component';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { MatiereService } from '../../../services/matiere/matiere.service';

@Component({
  selector: 'app-accueil-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatiereFormComponent],
  templateUrl: './accueil-matieres.component.html',
  styleUrl: './accueil-matieres.component.css'
})
export class AccueilMatieresComponent implements OnInit {
  matieres: IMatiere[] = [];
  filteredMatieres: IMatiere[] = [];
  selectedMatiere: IMatiere | null = null;
  searchTerm: string = '';
  showAddForm: boolean = false;
  isEditing: boolean = false;
  
  constructor(private matiereService: MatiereService) {}
  
  ngOnInit() {
    this.getMatieres();
  }
  
  // Méthode pour récupérer toutes les matières
  getMatieres(): void {
    this.matiereService.getAllMatieres().subscribe(
      (data) => {
        this.matieres = data;
        this.filteredMatieres = [...this.matieres];
        console.log('Matières chargées:', this.matieres);
      },
      (error) => {
        console.error('Erreur lors de la récupération des matières', error);
      }
    );
  }
  
  applyFilters() {
    this.filteredMatieres = this.matieres.filter((matiere) => {
      // Recherche textuelle sur le libellé
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
    this.filteredMatieres = [...this.matieres];
  }
  
  openAddForm() {
    this.showAddForm = true;
    this.selectedMatiere = null;
    this.isEditing = false;
  }
  
  modifierMatiere(matiere: IMatiere) {
    this.selectedMatiere = {...matiere};
    this.showAddForm = true;
    this.isEditing = true;
  }
  
  closeAddForm() {
    this.showAddForm = false;
    this.selectedMatiere = null;
  }
  
  // Méthode pour ajouter une matière
  ajouterMatiere(): void {
    if (this.selectedMatiere) {
      this.matiereService.ajouterMatiere(this.selectedMatiere).subscribe(
        (data) => {
          this.matieres.push(data);
          this.filteredMatieres = [...this.matieres];
          this.closeAddForm();
          console.log('Matière ajoutée avec succès', data);
        },
        (error) => {
          console.error("Erreur lors de l'ajout de la matière", error);
        }
      );
    }
  }
  
  // Méthode pour supprimer une matière
  supprimerMatiere(id: string | undefined): void {
    if (id) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer cette matière ?`)) {
        this.matiereService.supprimerMatiere(id).subscribe(
          () => {
            this.matieres = this.matieres.filter((matiere) => matiere.id !== id);
            this.filteredMatieres = [...this.matieres];
            console.log('Matière supprimée avec succès');
          },
          (error) => {
            console.error('Erreur lors de la suppression de la matière', error);
          }
        );
      }
    } else {
      console.error('ID de la matière non défini');
    }
  }
  
  // Méthode pour consulter les détails d'une matière
  consulterMatiere(id: string | undefined): void {
    if (id) {
      this.matiereService.consulterMatiere(id).subscribe(
        (data) => {
          this.selectedMatiere = data;
          this.showAddForm = true;
          console.log('Matière consultée', data);
        },
        (error) => {
          console.error('Erreur lors de la consultation de la matière', error);
        }
      );
    } else {
      console.error('ID de la matière non défini');
    }
  }
  
  // Méthode pour mettre à jour une matière
  updateMatiere(): void {
    if (this.selectedMatiere) {
      this.matiereService.updateMatiere(this.selectedMatiere).subscribe(
        (data) => {
          const index = this.matieres.findIndex((m) => m.id === data.id);
          if (index !== -1) {
            this.matieres[index] = data;
            this.filteredMatieres = [...this.matieres];
          }
          this.closeAddForm();
          console.log('Matière mise à jour avec succès', data);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la matière', error);
        }
      );
    }
  }
}