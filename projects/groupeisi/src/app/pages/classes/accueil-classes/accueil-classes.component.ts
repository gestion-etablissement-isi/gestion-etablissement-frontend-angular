import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseDetailsComponent } from '../classe-details/classe-details.component';
import { ClasseFormComponent } from '../classe-form/classe-form.component';
import { ClasseService } from '../../../services/classe/classe.service';
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
  styleUrl: './accueil-classes.component.css'
})
export class AccueilClassesComponent implements OnInit {
  classes: IClasse[] = [];
  classe: IClasse = {nom: '', annee_scolaire: '', capacite: 0 };
  filteredClasses: IClasse[] = [];
  selectedClasse: IClasse | null = null;

  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  isEditing: boolean = false;
  isAddFormOpen: boolean = false;

  // Filtres
  filtreAnneeScolaire: string = '';

  // Options pour les filtres
  anneesScolaires: string[] = ['2024-2025', '2023-2024', '2022-2023'];

  constructor(private classeService: ClasseService) {}

  ngOnInit() {
    this.getClasses();
    // Définir une année scolaire par défaut
    this.classe.annee_scolaire = this.anneesScolaires[0];
  }

  // Méthode pour récupérer toutes les classes
  getClasses(): void {
    this.classeService.getAllClasses().subscribe(
      (data) => {
        this.classes = data;
        this.filteredClasses = [...data]; // Initialiser filteredClasses avec toutes les classes
        this.applyFilters(); // Appliquer les filtres par défaut
      },
      (error) => {
        console.error('Erreur lors de la récupération des classes', error);
      }
    );
  }

  ajouterClasse(classe: IClasse): void {
    console.log('Données reçues :', classe); 
    if (this.isEditing && this.selectedClasse) {
      // Mise à jour d'une classe existante
      this.classeService.updateClasse(classe).subscribe(
        (data) => {
          const index = this.classes.findIndex((c) => c.id === data.id);
          if (index !== -1) {
            this.classes[index] = data;
            this.filteredClasses = [...this.classes];
            this.applyFilters();
          }
          this.closeAddForm();
          console.log('Classe mise à jour avec succès', data);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la classe', error);
        }
      );
    } else {
      // Ajout d'une nouvelle classe
      this.classeService.ajouterClasse(classe).subscribe(
        (data) => {
          this.classes.push(data);
          this.filteredClasses = [...this.classes];
          this.applyFilters();
          this.closeAddForm();
          console.log('Classe ajoutée avec succès', data);
        },
        (error) => {
          console.error("Erreur lors de l'ajout de la classe", error);
        }
      );
    }
  }

  // Méthode pour supprimer une classe
  supprimerClasse(id: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la classe ?`)) {
      this.classeService.supprimerClasse(id).subscribe(
        () => {
          this.classes = this.classes.filter((classe) => classe.id !== id);
          this.filteredClasses = this.filteredClasses.filter((classe) => classe.id !== id);
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
        this.selectedClasse = data;
        this.showDetails = true;
        console.log('Classe consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation de la classe', error);
      }
    );
  }

  // Méthode pour filtrer les classes selon les critères
  applyFilters() {
    this.filteredClasses = this.classes.filter((classe) => {
      // Recherche textuelle sur le nom
      const searchMatch =
        !this.searchTerm ||
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtres par année académique
      const anneeAcademiqueMatch =
        !this.filtreAnneeScolaire ||
        classe.annee_scolaire === this.filtreAnneeScolaire;

      return searchMatch && anneeAcademiqueMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreAnneeScolaire = '';
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

  openAddForm() {
    // Réinitialiser le modèle pour un nouvel ajout avec une année scolaire par défaut
    this.classe = {
      nom: '', 
      annee_scolaire: this.anneesScolaires[0], // Définir une valeur par défaut
      capacite: 0
    };
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedClasse = null;
    this.isEditing = false;
    this.isAddFormOpen = true;
  }

  openEditForm(classe: IClasse) {
    // Créer une copie profonde de l'objet classe
    this.selectedClasse = { ...classe };
    
    // S'assurer que l'année scolaire est définie
    if (!this.selectedClasse.annee_scolaire || this.selectedClasse.annee_scolaire === '') {
      this.selectedClasse.annee_scolaire = this.anneesScolaires[0];
    }
    
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
    
    // Réinitialiser l'objet classe avec l'année scolaire par défaut
    this.classe = {
      nom: '', 
      annee_scolaire: this.anneesScolaires[0],
      capacite: 0
    };
  }

  // Calcul correct du pourcentage d'occupation
  getOccupationPercentage(classe: IClasse): number {
    if (!classe.effectif || classe.capacite === 0) return 0;
    return Math.round((classe.effectif / classe.capacite) * 100);
  }
}