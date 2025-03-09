import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreneau } from '../../../interfaces/creneau.interface';
import { ICours } from '../../../interfaces/cours.interface';
import { Observable } from 'rxjs';





@Component({
    selector: 'app-creneau-details',
    imports: [CommonModule],
    templateUrl: './creneau-details.component.html',
    styleUrl: './creneau-details.component.css'
})
export class CreneauDetailsComponent {
  @Input() creneau: ICreneau | null = null;
  @Input() cours: string | null = null;
  @Input() classe: string | null = null;
  @Input() matiere: string | null = null;
  @Input() professeur: string | null = null;
  @Input() infosCours: ICours | any;
  @Output() close = new EventEmitter<void>();
  @Output() modify = new EventEmitter<ICreneau>();

  onBackdropClick(event: MouseEvent): void {
    // Fermer le modal uniquement si l'utilisateur clique sur l'arrière-plan
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close.emit();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  }

  peutModifier(): boolean {
    // Logique pour déterminer si l'utilisateur peut modifier ce créneau
    // À adapter selon votre système d'autorisations
    return true;
  }

  getRandomColor(): string {
    const colors = ['yellow', 'purple', 'darkblue', 'green', 'red', 'orange', 'pink', 'teal', 'brown']; // Ajout de plusieurs couleurs
    return colors[Math.floor(Math.random() * colors.length)];
  }

  modifierCreneau(): void {
    if (this.creneau) {
      this.modify.emit(this.creneau);
    }
  }
}
