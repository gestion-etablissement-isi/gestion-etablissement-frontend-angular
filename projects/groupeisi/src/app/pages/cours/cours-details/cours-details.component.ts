import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICours } from '../../../interfaces/cours.interface';
@Component({
    selector: 'app-cours-details',
    imports: [],
    templateUrl: './cours-details.component.html',
    styleUrl: './cours-details.component.css'
})
export class CoursDetailsComponent {
  @Input() cours: ICours | null = null;
  @Input() professeur: string | null = null ;
  @Input() classe: string | null = null ;
  @Input() matiere: string | null = null ;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
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
}
