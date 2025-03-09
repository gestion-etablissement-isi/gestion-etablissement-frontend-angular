import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IClasse } from '../../../interfaces/classe.interface';

@Component({
  selector: 'app-classe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classe-form.component.html',
  styleUrls: ['./classe-form.component.css'],
})
export class ClasseFormComponent {
  @Input() anneesScolaires: string[] = [];
  @Input() isEditing: boolean = false;
  @Input() set classe(value: IClasse | null) {
    if (value) {
      this._classe = { ...value }; // Copie profonde de l'objet
    } else {
      this._classe = { nom: '', annee_scolaire: '', capacite: 0}; // Initialisation par défaut
    }
  }
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<IClasse>();

  _classe: IClasse = {
    nom: '',
    annee_scolaire: '',
    capacite: 0,
  };

  formErrors: { [key: string]: string } = {};

  onClose() {
    this.close.emit();
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this._classe.nom) {
      this.formErrors['nom'] = 'Le nom est requis';
      isValid = false;
    }

    if (!this._classe.annee_scolaire) {
      this.formErrors['anneeScolaire'] = "L'année scolaire est requise";
      isValid = false;
    }

    if (this._classe.capacite < 1) {
      this.formErrors['capacite'] = 'La capacité doit être supérieure à 0';
      isValid = false;
    }


    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      console.log('Données du formulaire :', this._classe);
      this.save.emit(this._classe);
      this.close.emit();
      // window.location.reload(); // Recharge toute la page
    }
  }
}