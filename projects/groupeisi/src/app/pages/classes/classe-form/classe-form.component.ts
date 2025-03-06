import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../../services/classe.service';
import { IClasse } from '../../../interfaces/classe.interface';

@Component({
  selector: 'app-classe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classe-form.component.html',
  styleUrls: ['./classe-form.component.css']
})
export class ClasseFormComponent {
  @Input() anneesScolaires: string[] = [];
  @Input() isEditing: boolean = false;
  @Input() set classe(value: any) {
    if (value) {
      this._classe = { ...value };
    }
  }
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  _classe: IClasse = {
    nom: '',
    anneeScolaire: '',
    capacite: 0,
    effectif: 0,
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


    if (!this._classe.anneeScolaire) {
      this.formErrors['anneeScolaire'] = 'L\'année scolaire est requise';
      isValid = false;
    }


    if (this._classe.capacite < 1) {
      this.formErrors['capacite'] = 'La capacité doit être supérieure à 0';
      isValid = false;
    }

    if (this._classe.effectif! < 1) {
      this.formErrors['effectif'] = 'L\'effectif doit être supérieure à 0';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.save.emit(this._classe);
    }
  }
}