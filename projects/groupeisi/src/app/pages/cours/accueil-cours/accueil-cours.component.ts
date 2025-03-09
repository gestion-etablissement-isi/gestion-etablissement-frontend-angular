import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursDetailsComponent } from '../cours-details/cours-details.component';
import { CoursFormComponent } from '../cours-form/cours-form.component';
import { ICours } from '../../../interfaces/cours.interface';
import { CoursService } from '../../../services/cours/cours.service';
import { MatiereService } from '../../../services/matiere/matiere.service';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { IClasse } from '../../../interfaces/classe.interface';
import { ClasseService } from '../../../services/classe/classe.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-accueil-cours',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CoursDetailsComponent,
    CoursFormComponent,
  ],
  templateUrl: './accueil-cours.component.html',
  styleUrl: './accueil-cours.component.css',
})
export class AccueilCoursComponent implements OnInit {
  cours: ICours[] = [];
  mesCours: ICours = {titre: '', volumeHoraire: 0, coefficient: 0, anneeAcademique: '', matiereId: '', professeurId: '', classeId: '' };
  filteredCours: ICours[] = [];
  selectedCour: ICours | null = null;

  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  isEditing: boolean = false;
  isAddFormOpen: boolean = false;

  // Filtres
  filtreMatiere: string = '';
  filtreClasse: string = '';
  filtreProfesseur: string = '';
  filtreAnneeAcademique: string = '';

  // Options pour les filtres
  matieres: IMatiere[] = [];
  professeurs: IProfesseur[] = [];
  statuts: string[] = ['Actif', 'Inactif'];
  classes: IClasse[] = [];

  anneeAcademiques: string[] = ['2024-2025', '2025-2026', '2026-2027']; // Par exemple

  constructor(
    private matiereService: MatiereService,
    private professeurService: ProfesseurService,
    private classeService: ClasseService,
    private coursService: CoursService
  ) {}

  ngOnInit() {
    this.loadMatiere();
    this.loadProfesseur();
    this.loadClasse();
    this.getCours();
    // Définir une année académique par défaut
    this.mesCours.anneeAcademique = this.anneeAcademiques[0];
  }

  loadMatiere() {
    this.matiereService.getAllMatieres().subscribe(
      (data) => {
        this.matieres = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des matières', error);
      }
    );
  }

  // Charger les professeurs
  loadProfesseur() {
    this.professeurService.getAllProfesseurs().subscribe(
      (data) => {
        this.professeurs = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des professeurs', error);
      }
    );
  }

  // Charger les classes
  loadClasse() {
    this.classeService.getAllClasses().subscribe(
      (data) => {
        this.classes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des classes', error);
      }
    );
  }

  // Récupérer tous les cours
  getCours(): void {
    this.coursService.getAllCours().subscribe(
      (data) => {
        this.cours = data;
        this.filteredCours = [...data]; // Initialiser filteredCours avec tous les cours
        this.applyFilters(); // Appliquer les filtres par défaut
      },
      (error) => {
        console.error('Erreur lors de la récupération des cours', error);
      }
    );
  }

  // Méthode pour ajouter ou mettre à jour un cours
  ajouterCours(): void {
    if (this.isEditing && this.selectedCour) {
      // S'assurer que l'année académique est définie
      if (!this.selectedCour.anneeAcademique || this.selectedCour.anneeAcademique === '') {
        this.selectedCour.anneeAcademique = this.anneeAcademiques[0];
      }
      
      // Mise à jour d'un cours existant
      this.coursService.updateCours(this.selectedCour).subscribe(
        (data) => {
          const index = this.cours.findIndex((c) => c.id === data.id);
          if (index !== -1) {
            this.cours[index] = data;
            this.filteredCours = [...this.cours];
            this.applyFilters();
          }
          this.closeAddForm();
          console.log('Cours mis à jour avec succès', data);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du cours', error);
        }
      );
    } else {
      // S'assurer que l'année académique est définie
      if (!this.mesCours.anneeAcademique || this.mesCours.anneeAcademique === '') {
        this.mesCours.anneeAcademique = this.anneeAcademiques[0];
      }
      
      // Ajout d'un nouveau cours
      this.coursService.ajouterCours(this.mesCours).subscribe(
        (data) => {
          this.cours.push(data);
          this.filteredCours = [...this.cours];
          this.applyFilters();
          this.closeAddForm();
          console.log('Cours ajouté avec succès', data);
        },
        (error) => {
          console.error("Erreur lors de l'ajout du cours", error);
        }
      );
    }
  }

  // Méthode pour supprimer un cours
  supprimerCours(id: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le cours ?`)) {
      this.coursService.supprimerCours(id).subscribe(
        () => {
          this.cours = this.cours.filter((cours) => cours.id !== id);
          this.filteredCours = this.filteredCours.filter((cours) => cours.id !== id);
          console.log('Cours supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du cours', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'un cours
  consulterCours(id: string): void {
    this.coursService.consulterCours(id).subscribe(
      (data) => {
        this.selectedCour = data;
        this.showDetails = true;
        console.log('Cours consulté', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation du cours', error);
      }
    );
  }

  getMatiere(matiereId: string | null): string {
    if (!matiereId) return 'Non assigné';
    
    const matiere = this.matieres.find(m => m.id === matiereId);
    return matiere ? matiere.libelle : 'Matière introuvable';
  }

  getClasse(classeId: string | null): string {
    if (!classeId) return 'Non assigné';
    
    const classe = this.classes.find(c => c.id === classeId);
    return classe ? classe.nom: 'Classe introuvable';
  }

  getProfesseur(professeurId: string | null): string {
    if (!professeurId) return 'Non assigné';
    
    const professeur = this.professeurs.find(p => p.id === professeurId);
    return professeur ? professeur.prenom + " " + professeur.nom : 'Professeur introuvable';
  }

  applyFilters() {
    this.filteredCours = this.cours.filter((cour) => {
      // Recherche textuelle
      const searchMatch =
        !this.searchTerm ||
        cour.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.volumeHoraire.toString().includes(this.searchTerm) ||
        cour.coefficient.toString().includes(this.searchTerm) ||
        cour.anneeAcademique.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtres spécifiques
      const matiereMatch = !this.filtreMatiere || cour.matiereId === this.filtreMatiere;
      const professeurMatch = !this.filtreProfesseur || cour.professeurId === this.filtreProfesseur;
      const classeMatch = !this.filtreClasse || cour.classeId === this.filtreClasse;
      const anneeMatch = !this.filtreAnneeAcademique || cour.anneeAcademique === this.filtreAnneeAcademique;

      return searchMatch && matiereMatch && professeurMatch && classeMatch && anneeMatch;
    });
  }

  // Recherche
  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreMatiere = '';
    this.filtreProfesseur = '';
    this.filtreClasse = '';
    this.filtreAnneeAcademique = '';
    this.applyFilters();
  }

  showCoursDetails(cours: ICours) {
    this.selectedCour = cours;
    this.showDetails = true;
    this.showAddForm = false;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCour = null;
  }

  openAddForm() {
    // Réinitialiser le modèle pour un nouvel ajout avec une année académique par défaut
    this.mesCours = {
      titre: '', 
      volumeHoraire: 0, 
      coefficient: 0, 
      anneeAcademique: this.anneeAcademiques[0], // Définir une valeur par défaut
      matiereId: '', 
      professeurId: '', 
      classeId: ''
    };
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedCour = null;
    this.isEditing = false;
    this.isAddFormOpen = true;
  }

  fermerModalAjouterCours() {
    this.showAddForm = false;
  }

  openEditForm(cour: ICours) {
    if (!cour) return; // Vérifie que le cours est valide
    
    // Créer une copie profonde de l'objet cours
    this.selectedCour = { ...cour };

    // S'assurer que l'année académique est définie
    if (!this.selectedCour.anneeAcademique || this.selectedCour.anneeAcademique === '') {
      this.selectedCour.anneeAcademique = this.anneeAcademiques[0];
    }

    this.showAddForm = true;
    this.showDetails = false;
    this.isEditing = true;
    this.isAddFormOpen = true;
}


  closeAddForm() {
    this.showAddForm = false;
    this.selectedCour = null;
    this.isEditing = false;
    this.isAddFormOpen = false;
    
    // Réinitialiser l'objet mesCours avec l'année académique par défaut
    this.mesCours = {
      titre: '', 
      volumeHoraire: 0, 
      coefficient: 0, 
      anneeAcademique: this.anneeAcademiques[0],
      matiereId: '', 
      professeurId: '', 
      classeId: ''
    };
  }
}