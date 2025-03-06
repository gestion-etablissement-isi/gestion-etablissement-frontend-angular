import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtudiantDetailsComponent } from '../etudiant-details/etudiant-details.component';
import { EtudiantFormComponent } from '../etudiant-form/etudiant-form.component';
import { IEtudiant } from '../../../interfaces/etudiant.interface';
import { EtudiantService } from '../../../services/etudiant/etudiant.service';



@Component({
    selector: 'app-accueil-etudiant',
    imports: [CommonModule, FormsModule, EtudiantDetailsComponent, EtudiantFormComponent],
    templateUrl: './accueil-etudiant.component.html',
    styleUrl: './accueil-etudiant.component.css'
})
export class AccueilEtudiantComponent implements OnInit {
  etudiants: IEtudiant[] = [];
  filteredEtudiants: IEtudiant[] = [];
  selectedEtudiant: IEtudiant | null = null;
  etudiant: IEtudiant = {nom: '', prenom: '', email: '', tel: '', statut: ''};
  searchTerm: string = '';
  showAddForm: boolean = false;
  showDetails: boolean = false;
  
  // Filtres
  filtreClasse: string = '';
  filtreStatut: string = '';
  
  
  statuts: string[] = ['Actif', 'Inactif'];

  ngOnInit() {
    // Simuler le chargement des données depuis une API
    this.getEtudiants();
  }

  constructor(
    private etudiantService: EtudiantService
  ) {}

  getEtudiants(): void {
    this.etudiantService.getAllEtudiants().subscribe(
      (data) => {
        this.etudiants = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des etudiants', error);
      }
    );
  }

  applyFilters() {
    this.filteredEtudiants = this.etudiants.filter(etudiant => {
      // Recherche textuelle
      const searchMatch = !this.searchTerm || 
        etudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtres par catégorie
      const statutMatch = !this.filtreStatut || etudiant.statut === this.filtreStatut;
      
      return searchMatch && statutMatch;
    });
  }



  onSearch() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filtreClasse = '';
    this.filtreStatut = '';
    this.applyFilters();
  }

  showEtudiantDetails(etudiant: IEtudiant) {
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

  ajouterEtudiant(): void {
    this.etudiantService.ajouterEtudiant(this.etudiant).subscribe(
      (data) => {
        this.etudiants.push(data);
        console.log('Etudiant ajoutée avec succès', data);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'etudiant", error);
      }
    );
  }

  // Méthode pour supprimer un etudiant
  supprimerEtudiant(id: string): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer l'etudiant'  ?`)
    ) {
      this.etudiantService.supprimerEtudiant(id).subscribe(
        () => {
          this.etudiants = this.etudiants.filter((etudiant) => etudiant.id !== id); 
          console.log('Etudiant supprimée avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du etudiant', error);
        }
      );
    }
  }

  // Méthode pour consulter les détails d'une etudiant
  consulterProfesseur(id: string): void {
    this.etudiantService.consulterEtudiant(id).subscribe(
      (data) => {
        this.etudiant = data; 
        console.log('Etudiant consultée', data);
      },
      (error) => {
        console.error('Erreur lors de la consultation de la etudiant', error);
      }
    );
  }

  // Méthode pour mettre à jour une etudiant
  updateProfesseur(): void {
    this.etudiantService.updateEtudiant(this.etudiant).subscribe(
      (data) => {
        
        const index = this.etudiants.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          this.etudiants[index] = data;
        }
        console.log('etudiant mise à jour avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'etudiant', error);
      }
    );
  }
}
