import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
    selector: 'app-container',
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    templateUrl: './container.component.html',
    styleUrl: './container.component.css'
})
export class ContainerComponent {

}
