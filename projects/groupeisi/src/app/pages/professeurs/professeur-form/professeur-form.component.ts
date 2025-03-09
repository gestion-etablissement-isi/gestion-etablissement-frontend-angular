import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { IMatiere } from '../../../interfaces/matiere.interface';

@Component({
    selector: 'app-professeur-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './professeur-form.component.html',
    styleUrl: './professeur-form.component.css'
})
export class ProfesseurFormComponent{
  @Input() matieres: IMatiere[] = [];
  @Input() niveaux: string[] = [];
  @Input() user: any =  {};
  @Input() professeur: IProfesseur = {
    nom: '',
    prenom: '',
    email: '',
    matiereId: '', // Assurez-vous que matiereId est initialisé
    statut: 'Actif'
  };
  @Input() isEditing: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() getMatiere = new EventEmitter<string>();

  
  formErrors: { [key: string]: string } = {};

  onClose() {
    this.close.emit();
    console.log(this.matieres)
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.professeur?.nom) {
      this.formErrors['nom'] = 'Le nom est requis';
      isValid = false;
    }

    if (!this.professeur?.prenom) {
      this.formErrors['prenom'] = 'Le prénom est requis';
      isValid = false;
    }

    if (!this.professeur?.email) {
      this.formErrors['email'] = 'L\'email est requis';
      isValid = false;
    } else if (!this.validateEmail(this.professeur.email)) {
      this.formErrors['email'] = 'Format d\'email invalide';
      isValid = false;
    }

   

    if (!this.professeur?.matiereId) {
      this.formErrors['matiere'] = 'La matiere est requise';
      isValid = false;
    }

    

    return isValid;
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  onSubmit() {
    if (this.validateForm()) {
      console.log(this.professeur); // Vérifiez que matiereId est bien présent
      this.save.emit(this.professeur);
      window.location.reload();
    }
  }
  
}
