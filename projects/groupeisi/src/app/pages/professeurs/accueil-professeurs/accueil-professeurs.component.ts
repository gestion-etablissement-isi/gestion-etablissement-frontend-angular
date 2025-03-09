import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesseurDetailsComponent } from '../professeur-details/professeur-details.component';
import { ProfesseurFormComponent } from '../professeur-form/professeur-form.component';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { MatiereService } from '../../../services/matiere/matiere.service';
import { IMatiere } from '../../../interfaces/matiere.interface';

@Component({
    selector: 'app-accueil-professeurs',
    imports: [CommonModule, FormsModule, ProfesseurDetailsComponent, ProfesseurFormComponent],
    templateUrl: './accueil-professeurs.component.html',
    styleUrl: './accueil-professeurs.component.css'
})
export class AccueilProfesseursComponent implements OnInit {
  professeurs: IProfesseur[] = [];
  filteredProfesseurs: IProfesseur[] = [];
  selectedProfesseur: IProfesseur | null = null;
  professeur: IProfesseur = {nom: '', prenom: '', email: '', matiereId: '', statut: ''};
  
  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  isEditing: boolean = false;
  
  // Filtres
  filtreMatiere: string = '';
  filtreStatut: string = '';
  
  // Options pour les filtres
  matieres: IMatiere[] = [];
  statuts: string[] = ['Actif', 'Inactif'];

  constructor(
    private matiereService: MatiereService,
    private professeurService: ProfesseurService
  ) {}

  ngOnInit() {
    // Chargement des données
    this.getProfesseurs();
    this.loadMatiere();
  }

  // Méthode pour obtenir le libellé d'une matière à partir de son ID
  getMatiere(matiereId: string | null): string {
    if (!matiereId) return 'Non assigné';
    
    const matiere = this.matieres.find(m => m.id === matiereId);
    return matiere ? matiere.libelle : 'Matière introuvable';
  }
  
  // Chargement des matières
  loadMatiere() {
    this.matiereService.getAllMatieres().subscribe(
      (data) => {
        this.matieres = data;
        // Rafraîchir l'affichage après chargement des matières
        this.applyFilters();
      },
      (error) => {
        console.error('Erreur lors de la récupération des matières', error);
      }
    );
  }

  // Méthode pour récupérer tous les professeurs
  getProfesseurs(): void {
    this.professeurService.getAllProfesseurs().subscribe(
      (data) => {
        this.professeurs = data;
        this.filteredProfesseurs = [...data]; // Initialiser filteredProfesseurs avec une copie
        console.log('Professeurs chargés:', this.professeurs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des professeurs', error);
      }
    );
  }

  // Application des filtres
  applyFilters() {
    this.filteredProfesseurs = this.professeurs.filter(professeur => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        professeur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professeur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professeur.email.toLowerCase().includes(this.searchTerm.toLowerCase());
  
      // Filtrage par matière
      const matiereMatch = !this.filtreMatiere || professeur.matiereId === this.filtreMatiere;
  
      // Filtrage par statut - conversion en minuscules pour comparaison insensible à la casse
      const statutMatch = !this.filtreStatut || 
        professeur.statut.toLowerCase() === this.filtreStatut.toLowerCase();
  
      return searchMatch && matiereMatch && statutMatch;
    });
  }

  // Méthode appelée lors de la recherche
  onSearch() {
    this.applyFilters();
  }

  // Réinitialisation des filtres
  resetFilters() {
    this.searchTerm = '';
    this.filtreMatiere = '';
    this.filtreStatut = '';
    this.filteredProfesseurs = [...this.professeurs];
  }

  // Afficher les détails d'un professeur
  showProfesseurDetails(professeur: IProfesseur) {
    this.selectedProfesseur = {...professeur}; // Copie pour éviter les modifications directes
    this.showDetails = true;
    this.showAddForm = false;
  }

  // Fermer la fenêtre de détails
  closeDetails() {
    this.showDetails = false;
    this.selectedProfesseur = null;
  }

  // Ouvrir le formulaire d'ajout
  openAddForm() {
    this.professeur = {nom: '', prenom: '', email: '', matiereId: '', statut: 'Actif'};
    this.showAddForm = true;
    this.showDetails = false;
    this.isEditing = false;
  }

  openEditForm(professeur: IProfesseur) {
    // Créer une copie de l'objet professeur pour éviter les références partagées
    this.professeur = { ...professeur };
    this.isEditing = true;
    this.showAddForm = true;
    console.log("Professeur sélectionné :", this.professeur); // Débogage
  }

  // Fermer le formulaire d'ajout
  closeAddForm() {
    this.showAddForm = false;
  }

  // Ajouter un professeur
  ajouterProfesseur(): void {
    this.professeurService.ajouterProfesseur(this.professeur).subscribe(
      (data) => {
        this.professeurs.push(data);
        this.filteredProfesseurs = [...this.professeurs];
        this.closeAddForm();
        console.log('Professeur ajouté avec succès', data);
        
      },
      (error) => {
        console.error("Erreur lors de l'ajout du professeur", error);
      }
    );
  }

  // Méthode pour supprimer un professeur
  supprimerProfesseur(id: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce professeur ?`)) {
      this.professeurService.supprimerProfesseur(id).subscribe(
        () => {
          this.professeurs = this.professeurs.filter((professeur) => professeur.id !== id);
          this.filteredProfesseurs = this.filteredProfesseurs.filter((professeur) => professeur.id !== id);
          console.log('Professeur supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du professeur', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'un professeur
  consulterProfesseur(id: string): void {
    this.professeurService.consulterProfesseur(id).subscribe(
      (data) => {
        this.professeur = data; 
        console.log('Professeur consulté', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation du professeur', error);
      }
    );
  }

  // Méthode pour mettre à jour un professeur
  updateProfesseur(): void {
    this.professeurService.updateProfesseur(this.professeur).subscribe(
      (data) => {
        const index = this.professeurs.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.professeurs[index] = data;
          this.applyFilters(); // Mettre à jour la liste filtrée
        }
        console.log('Professeur mis à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du professeur', error);
      }
    );
  }
}