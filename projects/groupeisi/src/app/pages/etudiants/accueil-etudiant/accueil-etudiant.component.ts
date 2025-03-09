import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtudiantDetailsComponent } from '../etudiant-details/etudiant-details.component';
import { EtudiantFormComponent } from '../etudiant-form/etudiant-form.component';
import { IEtudiant } from '../../../interfaces/etudiant.interface';
import { EtudiantService } from '../../../services/etudiant/etudiant.service';

@Component({
  selector: 'app-accueil-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule, EtudiantDetailsComponent, EtudiantFormComponent],
  templateUrl: './accueil-etudiant.component.html',
  styleUrl: './accueil-etudiant.component.css'
})
export class AccueilEtudiantComponent implements OnInit {
  etudiants: IEtudiant[] = [];
  filteredEtudiants: IEtudiant[] = [];
  selectedEtudiant: IEtudiant | null = null;
  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  isEditing: boolean = false;

  // Filtres
  filtreStatut: string = '';
  statuts: string[] = ['Actif', 'Inactif'];

  constructor(private etudiantService: EtudiantService) {}

  ngOnInit() {
    this.getEtudiants();
  }

  // Récupérer tous les étudiants
  getEtudiants(): void {
    this.etudiantService.getAllEtudiants().subscribe(
      (data) => {
        this.etudiants = data;
        this.filteredEtudiants = [...this.etudiants]; // Mettre à jour filteredEtudiants
      },
      (error) => {
        console.error('Erreur lors de la récupération des étudiants', error);
      }
    );
  }

  // Appliquer les filtres
  applyFilters() {
    this.filteredEtudiants = this.etudiants.filter(etudiant => {
      const searchMatch = !this.searchTerm ||
        etudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statutMatch = !this.filtreStatut || etudiant.statut === this.filtreStatut;

      return searchMatch && statutMatch;
    });
  }

  // Recherche
  onSearch() {
    this.applyFilters();
  }

  // Réinitialiser les filtres
  resetFilters() {
    this.searchTerm = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  // Afficher les détails d'un étudiant
  showEtudiantDetails(etudiant: IEtudiant) {
    this.selectedEtudiant = etudiant;
    this.showDetails = true;
    this.showAddForm = false;
  }

  // Fermer les détails
  closeDetails() {
    this.showDetails = false;
    this.selectedEtudiant = null;
  }

  // Ouvrir le formulaire d'ajout
  openAddForm() {
    
    this.showAddForm = true;
    this.showDetails = false;
    this.selectedEtudiant = null;
    this.isEditing = false;
  }

  openEditForm(etudiant: IEtudiant) {
    this.selectedEtudiant = { ...etudiant };
    this.showAddForm = true;
    this.showDetails = false;
    // Ne pas réinitialiser selectedEtudiant à null
    this.isEditing = true;
  }

  // Fermer le formulaire d'ajout
  closeAddForm() {
    this.showAddForm = false;
  }

  // Ajouter un étudiant
  ajouterEtudiant(etudiant: IEtudiant): void {
    this.etudiantService.ajouterEtudiant(etudiant).subscribe(
      (data) => {
        this.etudiants.push(data);
        this.filteredEtudiants = [...this.etudiants]; // Mettre à jour filteredEtudiants
        this.closeAddForm();
        console.log('Étudiant ajouté avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'étudiant", error);
      }
    );
  }

  // Supprimer un étudiant
  supprimerEtudiant(id: string | undefined): void {
    if (id && confirm(`Êtes-vous sûr de vouloir supprimer cet étudiant ?`)) {
      this.etudiantService.supprimerEtudiant(id).subscribe(
        () => {
          this.etudiants = this.etudiants.filter((etudiant) => etudiant.id !== id);
          this.filteredEtudiants = [...this.etudiants]; // Mettre à jour filteredEtudiants
          console.log('Étudiant supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'étudiant', error);
        }
      );
    }
  }

  // Mettre à jour un étudiant
  updateEtudiant(etudiant: IEtudiant): void {
    this.etudiantService.updateEtudiant(etudiant).subscribe(
      (data) => {
        const index = this.etudiants.findIndex((e) => e.id === data.id);
        if (index !== -1) {
          this.etudiants[index] = data;
          this.filteredEtudiants = [...this.etudiants]; // Mettre à jour filteredEtudiants
        }
        this.closeAddForm();
        console.log('Étudiant mis à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'étudiant', error);
      }
    );
  }
}