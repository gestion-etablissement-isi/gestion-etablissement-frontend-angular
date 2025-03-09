import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { IClasse } from '../../../interfaces/classe.interface';
import { ICours } from '../../../interfaces/cours.interface';

interface Cours {
  id: number;
  titre: string;
  professeur: string; //1
  classe: string; //3
  matiere: string; //4
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: 'Actif' | 'Inactif';
  couleur: string;
}

@Component({
    selector: 'app-cours-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './cours-form.component.html',
    styleUrl: './cours-form.component.css'
})
export class CoursFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() coursAjoute = new EventEmitter<ICours>();
  @Input() professeur: string | null = null;
  @Input() classe: string | null = null;
  @Input() matiere: string | null = null;
  @Input() matieres: IMatiere[] = [];
  @Input() professeurs: IProfesseur[] = [];
  @Input() classes: IClasse[] = [];
  @Input() isEditing: Boolean = false;
  @Input() set cours(value: any) {
    if (value) {
      this.nouveauCours = { ...value };
    }
  }
  
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Données du formulaire
  nouveauCours: ICours = {
    titre: '',
    matiereId: '',
    professeurId: '',
    classeId: '',
    volumeHoraire: 0,
    coefficient: 0,
    anneeAcademique: '',
  };

  ngOnInit(): void {
    
    if (this.isEditing && this.nouveauCours) {
      // Important: Assurez-vous que ces affectations sont faites après que nouveauCours soit initialisé
      this.matiere = this.nouveauCours.matiereId;
      this.professeur = this.nouveauCours.professeurId;
      this.classe = this.nouveauCours.classeId;
      
      
    }
  }

  // Couleurs pour les cours
  couleurs: string[] = ['#4A77B4', '#6C5CE7', '#00B894', '#FF7675', '#FDCB6E', '#E84393', '#00CEC9'];
  
  getMatiere(matiereId: string | null): IMatiere | null {
    if (!matiereId) return null;
    
    const matiere = this.matieres.find(m => m.id === matiereId);
    return matiere ? matiere : null;
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
  
  fermer() {
    this.close.emit();
  }

  soumettre() {
    // Créer un objet cours avec les valeurs de référence correctes
    const coursToSubmit: ICours = {
      ...this.nouveauCours,
      matiereId: this.matiere || '',
      professeurId: this.professeur || '',
      classeId: this.classe || ''
    };
    
    // Émettre l'événement avec le cours complet
    this.coursAjoute.emit(coursToSubmit);
    this.fermer();
  }
}