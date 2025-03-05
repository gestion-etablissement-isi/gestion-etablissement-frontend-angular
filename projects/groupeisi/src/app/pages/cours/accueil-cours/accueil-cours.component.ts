import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursDetailsComponent } from '../cours-details/cours-details.component';
import { CoursFormComponent } from '../cours-form/cours-form.component';

interface Cours {
  id: number;
  titre: string;
  professeur: string;
  classe: string;
  matiere: string;
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: 'Actif' | 'Inactif';
}
@Component({
  selector: 'app-accueil-cours',
  standalone: true,
  imports: [CommonModule, FormsModule, CoursDetailsComponent, CoursFormComponent],
  templateUrl: './accueil-cours.component.html',
  styleUrl: './accueil-cours.component.css'
})
export class AccueilCoursComponent {
  cours: Cours[] = [];
  filteredCours: Cours[] = [];
  searchTerm: string = '';
  selectedCour: Cours | null = null;
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  // Filtres
  filtreMatiere: string = '';
  filtreClasse: string = '';
  filtreStatut: string = '';
  filtreProfesseur: string = '';
  filtreAnneeAcademique: string = '';
  
  // Options pour les filtres
  matieres: string[] = ['Mathématiques', 'Informatique', 'Systèmes Réseaux'];
  professeurs: string[] = ['M. Diallo', 'Mme Ndiaye', 'M. Sow', 'Claire Fontaine', 'Thomas Petit', 'Marie Leroy'];
  statuts: string[] = ['Actif', 'Inactif'];
  classes: string[] = ['Licence 1 GL', 'Licence 2 GL', 'Licence 3 GL', 'L3 IAGE'];  // Par exemple
  anneeAcademiques: string[] = ['2024-2025', '2025-2026', '2026-2027'];  // Par exemple

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.loadCours();
  }

  loadCours() {
    // Données fictives pour la démonstration
    this.cours = [
      {
        id: 1,
        titre: "Algèbre Linéaire",
        professeur: "M. Diallo",
        classe: "Licence 1 GL",
        matiere: "Mathématiques",
        volumeHoraire: 30,
        coefficient: 4,
        anneeAcademique: "2024-2025",
        statut: 'Actif'
      },
      {
        id: 2,
        titre: "Programmation Orientée Objet",
        professeur: "Mme Ndiaye",
        classe: "Licence 2 GL",
        matiere: "Informatique",
        volumeHoraire: 40,
        coefficient: 5,
        anneeAcademique: "2024-2025",
        statut: 'Inactif'
      },
      {
        id: 3,
        titre: "Réseaux et Protocoles",
        professeur: "M. Sow",
        classe: "Licence 3 GL",
        matiere: "Systèmes Réseaux",
        volumeHoraire: 35,
        coefficient: 3,
        anneeAcademique: "2024-2025",
        statut: 'Actif'
      }
    ];
    
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCours = this.cours.filter(cour => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        cour.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.professeur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.matiere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.anneeAcademique.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cour.classe.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtres par catégorie
      const matiereMatch = !this.filtreMatiere || cour.matiere === this.filtreMatiere;
      const professeurMatch = !this.filtreProfesseur || cour.professeur === this.filtreProfesseur;
      const statutMatch = !this.filtreStatut || cour.statut === this.filtreStatut;
      
      return searchMatch && matiereMatch && statutMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreMatiere = '';
    this.filtreProfesseur = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  showCoursDetails(cours: Cours) {
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

  

  ajouterCours(nouveauCours: Cours) {
    // Simuler l'ajout d'un pours avec un nouvel ID
    const newId = Math.max(...this.cours.map(e => e.id)) + 1;
    const newCours = { ...nouveauCours, id: newId };
    
    this.cours.push(newCours);
    this.applyFilters();
    this.fermerModalAjouterCours();
  }

  fermerModalAjouterCours() {
    this.showAddForm = false;
  }

  ouvrirModalAjouterCours() {
    this.showAddForm = true;
  }
  
}
