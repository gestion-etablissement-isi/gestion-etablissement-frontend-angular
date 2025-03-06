import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMatiere } from '../../../interfaces/matiere.interface';

@Component({
    selector: 'app-matiere-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './matiere-form.component.html',
    styleUrl: './matiere-form.component.css'
})
export class MatiereFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  matiere: IMatiere = {
    libelle: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  };

  formErrors: { [key: string]: string } = {};

  onClose() {
    this.close.emit();
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.matiere.libelle) {
      this.formErrors['matiere'] = 'La matiere est requise';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.save.emit(this.matiere);
    }
  }
}
