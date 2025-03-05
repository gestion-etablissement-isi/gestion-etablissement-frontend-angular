import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-etudiant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etudiant-form.component.html',
  styleUrl: './etudiant-form.component.css'
})
export class EtudiantFormComponent {
  @Input() classes: string[] = [];
  @Input() niveaux: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  etudiant = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    classe: '',
    niveau: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  };

  formErrors: { [key: string]: string } = {};

  onClose() {
    this.close.emit();
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.etudiant.nom) {
      this.formErrors['nom'] = 'Le nom est requis';
      isValid = false;
    }

    if (!this.etudiant.prenom) {
      this.formErrors['prenom'] = 'Le prénom est requis';
      isValid = false;
    }

    if (!this.etudiant.email) {
      this.formErrors['email'] = 'L\'email est requis';
      isValid = false;
    } else if (!this.validateEmail(this.etudiant.email)) {
      this.formErrors['email'] = 'Format d\'email invalide';
      isValid = false;
    }

    if (!this.etudiant.telephone) {
      this.formErrors['telephone'] = 'Le téléphone est requis';
      isValid = false;
    }

    if (!this.etudiant.dateNaissance) {
      this.formErrors['dateNaissance'] = 'La date de naissance est requise';
      isValid = false;
    }

    if (!this.etudiant.classe) {
      this.formErrors['classe'] = 'La classe est requise';
      isValid = false;
    }

    if (!this.etudiant.niveau) {
      this.formErrors['niveau'] = 'Le niveau est requis';
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
      this.save.emit(this.etudiant);
    }
  }
}
