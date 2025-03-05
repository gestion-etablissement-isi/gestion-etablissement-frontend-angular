import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtudiantDetailsComponent } from '../etudiant-details/etudiant-details.component';
import { EtudiantFormComponent } from '../etudiant-form/etudiant-form.component';

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  classe: string;
  niveau: string;
  statut: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-accueil-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule, EtudiantDetailsComponent, EtudiantFormComponent],
  templateUrl: './accueil-etudiant.component.html',
  styleUrl: './accueil-etudiant.component.css'
})
export class AccueilEtudiantComponent implements OnInit {
  etudiants: Etudiant[] = [];
  filteredEtudiants: Etudiant[] = [];
  searchTerm: string = '';
  selectedEtudiant: Etudiant | null = null;
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  // Filtres
  filtreClasse: string = '';
  filtreNiveau: string = '';
  filtreStatut: string = '';
  
  // Options pour les filtres
  classes: string[] = ['Terminale S', 'Terminale L', 'Première S', 'Première L', 'Seconde'];
  niveaux: string[] = ['Lycée', 'Collège', 'Primaire'];
  statuts: string[] = ['Actif', 'Inactif'];

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.loadEtudiants();
  }

  loadEtudiants() {
    // Données fictives pour la démonstration
    this.etudiants = [
      {
        id: 1,
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@example.com',
        telephone: '06 12 34 56 78',
        dateNaissance: '2005-05-15',
        classe: 'Terminale S',
        niveau: 'Lycée',
        statut: 'Actif'
      },
      {
        id: 2,
        nom: 'Martin',
        prenom: 'Lucas',
        email: 'lucas.martin@example.com',
        telephone: '06 23 45 67 89',
        dateNaissance: '2006-08-22',
        classe: 'Première S',
        niveau: 'Lycée',
        statut: 'Actif'
      },
      {
        id: 3,
        nom: 'Bernard',
        prenom: 'Emma',
        email: 'emma.bernard@example.com',
        telephone: '06 34 56 78 90',
        dateNaissance: '2007-03-10',
        classe: 'Seconde',
        niveau: 'Lycée',
        statut: 'Actif'
      },
      {
        id: 4,
        nom: 'Petit',
        prenom: 'Thomas',
        email: 'thomas.petit@example.com',
        telephone: '06 45 67 89 01',
        dateNaissance: '2006-11-30',
        classe: 'Première L',
        niveau: 'Lycée',
        statut: 'Inactif'
      },
      {
        id: 5,
        nom: 'Robert',
        prenom: 'Léa',
        email: 'lea.robert@example.com',
        telephone: '06 56 78 90 12',
        dateNaissance: '2005-07-18',
        classe: 'Terminale L',
        niveau: 'Lycée',
        statut: 'Actif'
      }
    ];
    
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEtudiants = this.etudiants.filter(etudiant => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        etudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtres par catégorie
      const classeMatch = !this.filtreClasse || etudiant.classe === this.filtreClasse;
      const niveauMatch = !this.filtreNiveau || etudiant.niveau === this.filtreNiveau;
      const statutMatch = !this.filtreStatut || etudiant.statut === this.filtreStatut;
      
      return searchMatch && classeMatch && niveauMatch && statutMatch;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreClasse = '';
    this.filtreNiveau = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  showEtudiantDetails(etudiant: Etudiant) {
    this.selectedEtudiant = etudiant;
    this.showDetails = true;
    this.showAddForm = false;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedEtudiant = null;
  }

  openAddForm() {
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedEtudiant = null;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  addEtudiant(etudiant: Etudiant) {
    // Simuler l'ajout d'un étudiant avec un nouvel ID
    const newId = Math.max(...this.etudiants.map(e => e.id)) + 1;
    const newEtudiant = { ...etudiant, id: newId };
    
    this.etudiants.push(newEtudiant);
    this.applyFilters();
    this.closeAddForm();
  }
}
