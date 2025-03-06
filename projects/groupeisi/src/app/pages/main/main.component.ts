import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from "../container/container.component";

@Component({
    selector: 'app-main',
    imports: [SidebarComponent, ContainerComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {

}
