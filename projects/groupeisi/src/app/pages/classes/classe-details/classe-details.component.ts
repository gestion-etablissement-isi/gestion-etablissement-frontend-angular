import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classe-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classe-details.component.html',
  styleUrls: ['./classe-details.component.css']
})
export class ClasseDetailsComponent {
  @Input() classe: any;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getOccupationPercentage(): number {
    return Math.round((this.classe.nombreEtudiants / this.classe.capacite) * 100);
  }
}