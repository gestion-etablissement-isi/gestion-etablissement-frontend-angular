import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IClasse } from '../../../interfaces/classe.interface';

@Component({
    selector: 'app-classe-details',
    imports: [CommonModule],
    templateUrl: './classe-details.component.html',
    styleUrls: ['./classe-details.component.css']
})
export class ClasseDetailsComponent {
  @Input() classe: IClasse | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getOccupationPercentage(): number {
    if (!this.classe || this.classe.capacite === undefined || this.classe.effectif === undefined) {
      return 0;  // ou une autre valeur par défaut
    }
  
    return Math.round((this.classe.effectif * 100) / this.classe.capacite );
  }
  
}