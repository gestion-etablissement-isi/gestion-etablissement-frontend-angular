import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-etudiant-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etudiant-details.component.html',
  styleUrl: './etudiant-details.component.css'
})
export class EtudiantDetailsComponent {
  @Input() etudiant: any;
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
