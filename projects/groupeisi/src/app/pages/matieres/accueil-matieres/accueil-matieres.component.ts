import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatiereFormComponent } from '../matiere-form/matiere-form.component';

interface Matiere {
  id: number;
  libelle: string;
  statut: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-accueil-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatiereFormComponent],
  templateUrl: './accueil-matieres.component.html',
  styleUrl: './accueil-matieres.component.css'
})
export class AccueilMatieresComponent implements OnInit {
  matieres: Matiere[] = [];
  filteredMatieres: Matiere[] = [];
  searchTerm: string = '';
  selectedMatiere: Matiere | null = null;
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  filtreStatut: string = '';
  
  statuts: string[] = ['Actif', 'Inactif'];

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.loadmatieres();
  }

  loadmatieres() {
    // Données fictives pour la démonstration
    this.matieres = [
      {
        id: 1,
        libelle: 'Algorithme',
        statut: 'Actif'
      },
      {
        id: 2,
        libelle: 'Java',
        statut: 'Actif'
      },
      {
        id: 3,
        libelle: 'C#',
        statut: 'Actif'
      },
      {
        id: 4,
        libelle: 'DevOps',
        statut: 'Inactif'
      },
      {
        id: 5,
        libelle: 'Angular',
        statut: 'Actif'
      }
    ];
    
    this.applyFilters();
  }

  applyFilters() {
    this.filteredMatieres = this.matieres.filter(matiere => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        matiere.libelle.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtres par catégorie
      const statutMatch = !this.filtreStatut || matiere.statut === this.filtreStatut;
      
      return searchMatch && statutMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreStatut = '';
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

  addmatiere(matiere: Matiere) {
    // Simuler l'ajout d'un matiere avec un nouvel ID
    const newId = Math.max(...this.matieres.map(m => m.id)) + 1;
    const newMatiere = { ...matiere, id: newId };
    
    this.matieres.push(newMatiere);
    this.applyFilters();
    this.closeAddForm();
  }
}
