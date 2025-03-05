import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  collapsed = false;
  activeItem = 'Accueil';
  
  menuItems = [
    { name: 'Accueil', tag:'accueil',  icon: 'home' },
    { name: 'Classes', tag:'classes', icon: 'school' },
    { name: 'Matieres', tag:'matieres', icon: 'book' },
    { name: 'Cours', tag:'cours', icon: 'cours' },
    { name: 'Etudiants', tag:'etudiants', icon: 'people' },
    { name: 'Professeurs', tag:'professeurs', icon: 'person' },
    { name: 'Emploi du temps', tag:'emploi-du-temps', icon: 'calendar' }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  constructor(
    private router: Router
  ) {}

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.collapsed = window.innerWidth < 768;
    }
  }
  

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  setActiveItem(item: string) {
    this.activeItem = item;
  }

  navigateTo(item: string) {
    this.setActiveItem(item);
    console.log(item.toLowerCase())
    this.router.navigateByUrl('/main/' + item.toLowerCase());
  }
}
