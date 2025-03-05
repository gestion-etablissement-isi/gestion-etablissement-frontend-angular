import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cours {
  id: number;
  titre: string;
  professeur: string;
  classe: string;
  matiere: string;
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: string;
}

interface Creneau {
  id: number;
  cours: Cours;
  descriptions: CreneauDescription[];
  couleur: string;
}

interface CreneauDescription {
  date: string;
  salle: string;
  description: string;
  heureDebut: string;
  heureFin: string;
}

@Component({
  selector: 'app-creneau-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creneau-details.component.html',
  styleUrl: './creneau-details.component.css'
})
export class CreneauDetailsComponent {
  @Input() creneau: Creneau | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() modify = new EventEmitter<Creneau>();

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

  modifierCreneau(): void {
    if (this.creneau) {
      this.modify.emit(this.creneau);
    }
  }
}
