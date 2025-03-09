import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { MatiereService } from '../../../services/matiere/matiere.service';

@Component({
    selector: 'app-matiere-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './matiere-form.component.html',
    styleUrls: ['./matiere-form.component.css']
})
export class MatiereFormComponent {
    // @Input() matiere: IMatiere | null = null; // Peut être null
    @Input() isEditing: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<IMatiere>();
    mat: IMatiere = {
      libelle: '',
      statut: '',
    };

    formErrors: { [key: string]: string } = {};

    constructor(private matiereService: MatiereService) {}

    

    validateForm(): boolean {
        this.formErrors = {};
        let isValid = true;

        if (!this.mat.libelle) {
            this.formErrors['libelle'] = 'Le libellé est requis';
            isValid = false;
        }

        if (!this.mat.statut) {
            this.formErrors['statut'] = 'Le statut est requis';
            isValid = false;
        }

        return isValid;
    }

    onSubmit() {
        console.log('Form submitted with:', this.mat);
        if (!this.validateForm()) {
            return; // Ne pas soumettre si le formulaire est invalide
        }

        if (this.isEditing) {
            this.matiereService.updateMatiere(this.mat).subscribe(
                (response) => {
                    console.log('Matière mise à jour avec succès', response);
                    this.save.emit(response);
                },
                (error) => {
                    console.error('Erreur lors de la mise à jour de la matière', error);
                }
            );
        } else {
            this.matiereService.ajouterMatiere(this.mat).subscribe(
                (response) => {
                    console.log('Matière ajoutée avec succès', response);
                    this.save.emit(response);
                },
                (error) => {
                    console.error('Erreur lors de l\'ajout de la matière', error);
                }
            );
        }
    }

    onClose() {
        this.close.emit();
    }
}