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
import { ClasseService } from '../../../services/classe.service';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-accueil-cours',
  imports: [
    CommonModule,
    FormsModule,
    CoursDetailsComponent,
    CoursFormComponent,
  ],
  templateUrl: './accueil-cours.component.html',
  styleUrl: './accueil-cours.component.css',
})
export class AccueilCoursComponent {
  cours: ICours[] = [];
  mesCours: ICours = {titre: '', volumeHoraire: 0, coefficient: 0, anneeAcademique: '', matiereId: '', professeurId: '', classeId: '' };
  filteredCours: ICours[] = [];
  selectedCour: ICours | null = null;

  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;

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

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.loadMatiere();
    this.loadProfesseur();
    this.loadClasse();
    this.getCours();
  }

  constructor(
    private matiereService: MatiereService,
    private professeurService: ProfesseurService,
    private classeService: ClasseService,
    private coursService: CoursService
  ) {}

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

  getMatiere(matiereId: string): Observable<string> {
    return this.matiereService.consulterMatiere(matiereId).pipe(
      map((matiere) => matiere ? matiere.libelle : 'Matière introuvable')
    );
  }

  getClasse(classeId: string): Observable<string> {
    return this.classeService.consulterClasse(classeId).pipe(
      map((cl) => cl ? cl.nom : 'Classe introuvable')
    );
  }

  getProfesseur(professeurId: string): Observable<string> {
    return this.professeurService.consulterProfesseur(professeurId).pipe(
      map((cl) => cl ? cl.prenom + " " + cl.nom : 'Professeur introuvable')
    );
  }
  

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

  // Méthode pour récupérer tous les cours
  getCours(): void {
    this.coursService.getAllCours().subscribe(
      (data) => {
        this.cours = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des professeurs', error);
      }
    );
  }

  applyFilters() {
    this.filteredCours = this.cours.filter((cour) => {
      // Recherche textuelle
      const searchMatch =
        !this.searchTerm ||
        cour.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.volumeHoraire
          .toString()
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        cour.coefficient
          .toString()
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        cour.anneeAcademique
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        this.matiereService.consulterMatiere(cour.matiereId).forEach((matiere) => {
          matiere.libelle.toLowerCase().includes(this.searchTerm.toLowerCase());}) ||
        this.professeurService.consulterProfesseur(cour.professeurId).forEach((professeur) => {
          professeur.nom.toLowerCase().includes(this.searchTerm.toLowerCase());}
        ) ||
        this.professeurService.consulterProfesseur(cour.professeurId).forEach((professeur) => {
          professeur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase());}
        ) ||
        this.classeService.consulterClasse(cour.classeId).forEach((classe) => {
          classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase());}
        );


      // Filtres par catégorie
      const matiereMatch = !this.filtreMatiere || this.matiereService.consulterMatiere(cour.matiereId).forEach((matiere) => {matiere.libelle === this.filtreMatiere});
      const professeurMatch = !this.filtreProfesseur || this.professeurService.consulterProfesseur(cour.professeurId).forEach((prof) => {prof.prenom + " " + prof.nom === this.filtreProfesseur });
      const classeMatch = !this.filtreClasse || this.classeService.consulterClasse(cour.classeId).forEach((cl) => {cl.nom === this.filtreClasse } );

      return searchMatch && matiereMatch && professeurMatch && classeMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreMatiere = '';
    this.filtreProfesseur = '';
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
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedCour = null;
  }

  ajouterCours(): void {
    this.coursService.ajouterCours(this.mesCours).subscribe(
      (data) => {
        this.cours.push(data);
        console.log('Cours ajoutée avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout du cours", error);
      }
    );
  }

  // Méthode pour supprimer une cours
  supprimerCours(id: string): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer le cours  ?`)
    ) {
      this.coursService.supprimerCours(id).subscribe(
        () => {
          this.cours = this.cours.filter((cours) => cours.id !== id); 
          console.log('Cours supprimée avec succès');
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
        this.mesCours = data; 
        console.log('Cours consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation du cours', error);
      }
    );
  }

  // Méthode pour mettre à jour un cours
  updateCours(): void {
    this.coursService.updateCours(this.mesCours).subscribe(
      (data) => {
        
        const index = this.cours.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.cours[index] = data;
        }
        console.log('Cours mise à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du cours', error);
      }
    );
  }

  fermerModalAjouterCours() {
    this.showAddForm = false;
  }

  ouvrirModalAjouterCours() {
    this.showAddForm = true;
  }
}
