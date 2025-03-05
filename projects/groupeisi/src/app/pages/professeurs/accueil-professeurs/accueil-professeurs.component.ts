import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesseurDetailsComponent } from '../professeur-details/professeur-details.component';
import { ProfesseurFormComponent } from '../professeur-form/professeur-form.component';

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matiere: string,
  statut: 'Actif' | 'Inactif';
}
@Component({
  selector: 'app-accueil-professeurs',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfesseurDetailsComponent, ProfesseurFormComponent],
  templateUrl: './accueil-professeurs.component.html',
  styleUrl: './accueil-professeurs.component.css'
})
export class AccueilProfesseursComponent {
  professeurs: Professeur[] = [];
  filteredProfesseurs: Professeur[] = [];
  searchTerm: string = '';
  selectedProfesseur: Professeur | null = null;
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  // Filtres
  filtreMatiere: string = '';
  filtreStatut: string = '';
  
  // Options pour les filtres
  matieres: string[] = ['Algorithme', 'Java', 'C#', 'DevOps', 'Angular'];
  statuts: string[] = ['Actif', 'Inactif'];

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.loadProfesseurs();
  }

  loadProfesseurs() {
    // Données fictives pour la démonstration
    this.professeurs = [
      {
        id: 1,
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@example.com',
        matiere: 'Algorithme',
        statut: 'Actif'
      },
      {
        id: 2,
        nom: 'Martin',
        prenom: 'Lucas',
        email: 'lucas.martin@example.com',
        matiere: 'Java',
        statut: 'Actif'
      },
      {
        id: 3,
        nom: 'Bernard',
        prenom: 'Emma',
        email: 'emma.bernard@example.com',
        matiere: 'C#',
        statut: 'Actif'
      },
      {
        id: 4,
        nom: 'Petit',
        prenom: 'Thomas',
        email: 'thomas.petit@example.com',
        matiere: 'DevOps',
        statut: 'Inactif'
      },
      {
        id: 5,
        nom: 'Robert',
        prenom: 'Léa',
        email: 'lea.robert@example.com',
        matiere: 'Angular',
        statut: 'Actif'
      }
    ];
    
    this.applyFilters();
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

  showProfesseurDetails(professeur: Professeur) {
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

  addProfesseur(professeur: Professeur) {
    // Simuler l'ajout d'un professeur avec un nouvel ID
    const newId = Math.max(...this.professeurs.map(e => e.id)) + 1;
    const newprofesseur = { ...professeur, id: newId };
    
    this.professeurs.push(newprofesseur);
    this.applyFilters();
    this.closeAddForm();
  }
}
