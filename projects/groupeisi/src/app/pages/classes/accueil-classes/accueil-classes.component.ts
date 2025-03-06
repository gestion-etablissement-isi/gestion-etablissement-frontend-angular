import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseDetailsComponent } from '../classe-details/classe-details.component';
import { ClasseFormComponent } from '../classe-form/classe-form.component';
import { ClasseService } from '../../../services/classe.service';
import { IClasse } from '../../../interfaces/classe.interface';

@Component({
  selector: 'app-accueil-classes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClasseDetailsComponent,
    ClasseFormComponent,
  ],
  templateUrl: './accueil-classes.component.html',
  styleUrl: './accueil-classes.component.css',
})
export class AccueilClassesComponent {
  classes: IClasse[] = [];
  classe: IClasse = { id: '', nom: '', anneeScolaire: '', capacite: 0 };
  filteredClasses: IClasse[] = [];
  selectedClasse: IClasse | null = null;

  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  isEditing: boolean = false;

  // Filtres
  filtreNiveau: string = '';
  filtreAnneeScolaire: string = '';
  filtreStatut: string = '';

  // Options pour les filtres
  niveaux: string[] = ['Lycée', 'Collège', 'Primaire'];
  anneesScolaires: string[] = ['2024-2025', '2023-2024', '2022-2023'];
  statuts: string[] = ['Active', 'Inactive'];

  ngOnInit() {
    this.getClasses();
  }

  constructor(private classeService: ClasseService) {}

  // Méthode pour récupérer toutes les classes
  getClasses(): void {
    this.classeService.getAllClasses().subscribe(
      (data) => {
        this.classes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des classes', error);
      }
    );
  }

  // Méthode pour ajouter une classe
  ajouterClasse(): void {
    this.classeService.ajouterClasse(this.classe).subscribe(
      (data) => {
        this.classes.push(data);
        console.log('Classe ajoutée avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la classe", error);
      }
    );
  }

  // Méthode pour supprimer une classe
  supprimerClasse(id: string): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la classe ?`)
    ) {
      this.classeService.supprimerClasse(id).subscribe(
        () => {
          this.classes = this.classes.filter((classe) => classe.id !== id); // Supprimer la classe de la liste
          console.log('Classe supprimée avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression de la classe', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'une classe
  consulterClasse(id: string): void {
    this.classeService.consulterClasse(id).subscribe(
      (data) => {
        this.classe = data; // Afficher les détails de la classe dans le formulaire ou la vue
        console.log('Classe consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation de la classe', error);
      }
    );
  }

  // Méthode pour mettre à jour une classe
  updateClasse(): void {
    this.classeService.updateProduit(this.classe).subscribe(
      (data) => {
        // Mettre à jour l'élément dans la liste des classes
        const index = this.classes.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.classes[index] = data;
        }
        console.log('Classe mise à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la classe', error);
      }
    );
  }

  applyFilters() {
    this.filteredClasses = this.classes.filter((classe) => {
      // Recherche textuelle sur le nom
      const searchMatch =
        !this.searchTerm ||
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtres par année académique
      const anneeAcademiqueMatch =
        !this.filtreAnneeScolaire ||
        classe.anneeScolaire === this.filtreAnneeScolaire;

      return searchMatch && anneeAcademiqueMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreNiveau = '';
    this.filtreAnneeScolaire = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  showClasseDetails(classe: IClasse) {
    this.selectedClasse = classe;
    this.showDetails = true;
    this.showAddForm = false;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedClasse = null;
  }

  isAddFormOpen = false;
  openAddForm() {
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedClasse = null;
    this.isEditing = false;
    this.isAddFormOpen = true;
  }

  openEditForm(classe: IClasse) {
    this.selectedClasse = { ...classe };
    this.showAddForm = true;
    this.showDetails = false;
    this.isEditing = true;
    this.isAddFormOpen = true;
  }

  closeAddForm() {
    this.showAddForm = false;
    this.selectedClasse = null;
    this.isEditing = false;
    this.isAddFormOpen = false;
  }

  

  getOccupationPercentage(classe: IClasse): number {
    return Math.round((classe.effectif || 0 / classe.capacite) * 100);
  }
}
