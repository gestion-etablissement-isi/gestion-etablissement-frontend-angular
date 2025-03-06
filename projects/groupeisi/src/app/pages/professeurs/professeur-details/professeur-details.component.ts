import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProfesseur } from '../../../interfaces/professeur.interface';

@Component({
    selector: 'app-professeur-details',
    imports: [CommonModule],
    templateUrl: './professeur-details.component.html',
    styleUrl: './professeur-details.component.css'
})
export class ProfesseurDetailsComponent {
  @Input() professeur: IProfesseur| null = null;
  @Output() getMatiere = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
