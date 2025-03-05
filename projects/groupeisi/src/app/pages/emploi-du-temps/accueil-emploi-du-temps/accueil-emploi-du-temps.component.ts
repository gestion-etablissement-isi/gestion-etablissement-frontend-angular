import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreneauDetailsComponent } from '../creneau-details/creneau-details.component';
import { AjouterCreneauComponent } from '../ajouter-creneau/ajouter-creneau.component';

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

interface JourCalendrier {
  date: Date;
  creneau: Creneau[];
  estJourActuel: boolean;
  estMoisActuel: boolean;
}
@Component({
  selector: 'app-accueil-emploi-du-temps',
  standalone: true,
  imports: [CommonModule, FormsModule, CreneauDetailsComponent, AjouterCreneauComponent],
  templateUrl: './accueil-emploi-du-temps.component.html',
  styleUrl: './accueil-emploi-du-temps.component.css'
})
export class AccueilEmploiDuTempsComponent implements OnInit  {
  // Données
  creneau: Creneau[] = [];
  joursDuCalendrier: JourCalendrier[] = [];

  // Filtres
  filtreClasse: string = '';
  filtreProfesseur: string = '';
  filtreMatiere: string = '';

  // Options pour les filtres
  classes: string[] = ['Terminale S', 'Terminale L', 'Première S', 'Première L', 'Seconde A', 'Seconde B'];
  professeurs: string[] = ['Martin Dubois', 'Sophie Moreau', 'Philippe Lambert', 'Claire Fontaine', 'Thomas Petit', 'Marie Leroy'];
  matieres: string[] = ['Mathématiques', 'Physique-Chimie', 'Français', 'Histoire-Géographie', 'SVT', 'Anglais', 'Philosophie'];

  // Gestion du calendrier
  dateActuelle: Date = new Date();
  moisActuel: Date = new Date();
  vueCalendrier: 'jour' | 'semaine' | 'mois' = 'mois';

  // Gestion des détails
  selectedCreneau: Creneau | null = null;
  showDetails: boolean = false;

  // Gestion de l'ajout de creneau
  showAjouterCreneau: boolean = false;

  // Jours de la semaine
  joursSemaine: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  ngOnInit() {
    this.loadCreneau();
    this.genererCalendrier();
  }

  loadCreneau() {
    // Données fictives pour la démonstration
    this.creneau = [
      {
        id: 1,
        cours: {
          id: 1,
          titre: 'Mathématiques',
          professeur: 'Martin Dubois',
          classe: 'Terminale S',
          matiere: 'Mathématiques',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-01',
            salle: 'A101',
            description: 'Cours de mathématiques - Chapitre sur les fonctions',
            heureDebut: '08:00',
            heureFin: '10:00',
          }
        ],
        couleur: '#4A77B4',
      },
      {
        id: 2,
        cours: {
          id: 2,
          titre: 'Physique-Chimie',
          professeur: 'Sophie Moreau',
          classe: 'Terminale S',
          matiere: 'Physique-Chimie',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-01',
            salle: 'B202',
            description: 'Cours de physique - Travaux pratiques',
            heureDebut: '10:15',
            heureFin: '12:15',
          }
        ],
        couleur: '#6C5CE7',
      },
      {
        id: 3,
        cours: {
          id: 3,
          titre: 'Français',
          professeur: 'Claire Fontaine',
          classe: 'Première L',
          matiere: 'Français',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-02',
            salle: 'C103',
            description: 'Étude de texte - Baudelaire',
            heureDebut: '13:30',
            heureFin: '15:30',
          }
        ],
        couleur: '#00B894',
      },
      {
        id: 4,
        cours: {
          id: 4,
          titre: 'Histoire-Géographie',
          professeur: 'Thomas Petit',
          classe: 'Terminale L',
          matiere: 'Histoire-Géographie',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-03',
            salle: 'D105',
            description: 'La Seconde Guerre mondiale',
            heureDebut: '08:00',
            heureFin: '10:00',
          }
        ],
        couleur: '#FF7675',
      },
      {
        id: 5,
        cours: {
          id: 5,
          titre: 'SVT',
          professeur: 'Marie Leroy',
          classe: 'Première S',
          matiere: 'SVT',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-04',
            salle: 'B201',
            description: 'Génétique et évolution',
            heureDebut: '10:15',
            heureFin: '12:15',
          }
        ],
        couleur: '#FDCB6E',
      },
      {
        id: 6,
        cours: {
          id: 6,
          titre: 'Anglais',
          professeur: 'Philippe Lambert',
          classe: 'Seconde A',
          matiere: 'Anglais',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-05',
            salle: 'A102',
            description: 'Expression orale - Débat',
            heureDebut: '13:30',
            heureFin: '15:30',
          }
        ],
        couleur: '#E84393',
      },
      {
        id: 7,
        cours: {
          id: 7,
          titre: 'Philosophie',
          professeur: 'Claire Fontaine',
          classe: 'Terminale L',
          matiere: 'Philosophie',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-06',
            salle: 'C104',
            description: 'La conscience et l\'inconscient',
            heureDebut: '08:00',
            heureFin: '10:00',
          }
        ],
        couleur: '#00CEC9',
      },
      {
        id: 8,
        cours: {
          id: 8,
          titre: 'Mathématiques',
          professeur: 'Martin Dubois',
          classe: 'Première S',
          matiere: 'Mathématiques',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-09',
            salle: 'A101',
            description: 'Probabilités et statistiques',
            heureDebut: '10:15',
            heureFin: '12:15',
          }
        ],
        couleur: '#4A77B4',
      },
      {
        id: 9,
        cours: {
          id: 9,
          titre: 'Physique-Chimie',
          professeur: 'Sophie Moreau',
          classe: 'Terminale S',
          matiere: 'Physique-Chimie',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-10',
            salle: 'B202',
            description: 'Électromagnétisme',
            heureDebut: '13:30',
            heureFin: '15:30',
          }
        ],
        couleur: '#6C5CE7',
      },
      {
        id: 10,
        cours: {
          id: 10,
          titre: 'Français',
          professeur: 'Claire Fontaine',
          classe: 'Première L',
          matiere: 'Français',
          volumeHoraire: 2, // À ajuster si nécessaire
          coefficient: 1,   // À ajuster si nécessaire
          anneeAcademique: '2025-2026',
          statut: 'Actif',
        },
        descriptions: [
          {
            date: '2025-06-11',
            salle: 'C103',
            description: 'Dissertation',
            heureDebut: '08:00',
            heureFin: '10:00',
          }
        ],
        couleur: '#00B894',
      },
      // Continuer pour le reste des créneaux...
    ];
    

    // Mettre à jour les dates pour qu'elles soient relatives au mois actuel
    const aujourdhui = new Date();
    this.creneau = this.creneau.map(creneau => {
      creneau.descriptions = creneau.descriptions.map(description => {
        const dateOrigine = new Date(description.date);
        const nouvelleDate = new Date(
          aujourdhui.getFullYear(),
          aujourdhui.getMonth(),
          dateOrigine.getDate()
        );
        return {
          ...description,
          date: nouvelleDate.toISOString().split('T')[0], // format AAAA-MM-JJ
        };
      });
    
      return creneau;
    });
  }

  genererCalendrier() {
    this.joursDuCalendrier = [];

    if (this.vueCalendrier === 'mois') {
      this.genererVueMois();
    } else if (this.vueCalendrier === 'semaine') {
      this.genererVueSemaine();
    } else {
      this.genererVueJour();
    }
  }

  genererVueMois() {
    const annee = this.moisActuel.getFullYear();
    const mois = this.moisActuel.getMonth();

    // Premier jour du mois
    const premierJour = new Date(annee, mois, 1);
    // Dernier jour du mois
    const dernierJour = new Date(annee, mois + 1, 0);

    // Ajuster pour commencer par le lundi (1) plutôt que le dimanche (0)
    let debutSemaine = premierJour.getDay() - 1;
    if (debutSemaine === -1) debutSemaine = 6; // Si c'est dimanche (0), on le met à la fin (6)

    // Jours du mois précédent pour compléter la première semaine
    const dernierJourMoisPrecedent = new Date(annee, mois, 0).getDate();
    for (let i = debutSemaine - 1; i >= 0; i--) {
      const date = new Date(annee, mois - 1, dernierJourMoisPrecedent - i);
      this.joursDuCalendrier.push({
        date,
        creneau: this.getCreneauForDate(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: false
      });
    }

    // Jours du mois actuel
    for (let jour = 1; jour <= dernierJour.getDate(); jour++) {
      const date = new Date(annee, mois, jour);
      this.joursDuCalendrier.push({
        date,
        creneau: this.getCreneauForDate(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: true
      });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const joursRestants = 42 - this.joursDuCalendrier.length; // 6 semaines * 7 jours = 42
    for (let jour = 1; jour <= joursRestants; jour++) {
      const date = new Date(annee, mois + 1, jour);
      this.joursDuCalendrier.push({
        date,
        creneau: this.getCreneauForDate(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: false
      });
    }
  }

  genererVueSemaine() {
    // Trouver le lundi de la semaine actuelle
    const date = new Date(this.moisActuel);
    const jour = date.getDay() || 7; // Convertir 0 (dimanche) en 7
    date.setDate(date.getDate() - jour + 1); // Lundi

    // Générer les 7 jours de la semaine
    for (let i = 0; i < 7; i++) {
      const jourCourant = new Date(date);
      jourCourant.setDate(date.getDate() + i);

      this.joursDuCalendrier.push({
        date: jourCourant,
        creneau: this.getCreneauForDate(jourCourant),
        estJourActuel: this.estJourActuel(jourCourant),
        estMoisActuel: jourCourant.getMonth() === this.moisActuel.getMonth()
      });
    }
  }

  genererVueJour() {
    const date = new Date(this.moisActuel);

    this.joursDuCalendrier.push({
      date,
      creneau: this.getCreneauForDate(date),
      estJourActuel: this.estJourActuel(date),
      estMoisActuel: true
    });
  }

  getCreneauForDate(date: Date): Creneau[] {
    const dateStr = date.toISOString().split('T')[0];
    
    // Filtrer les créneaux qui ont au moins une description pour cette date
    const creneauxFiltered = this.creneau.filter(creneau => {
      // Vérifier si au moins une description correspond à la date
      const dateMatch = creneau.descriptions.some(desc => desc.date === dateStr);
      
      // Appliquer les filtres utilisateur
      const classeMatch = !this.filtreClasse || creneau.cours.classe === this.filtreClasse;
      const professeurMatch = !this.filtreProfesseur || creneau.cours.professeur === this.filtreProfesseur;
      const matiereMatch = !this.filtreMatiere || creneau.cours.matiere === this.filtreMatiere;
      
      return dateMatch && classeMatch && professeurMatch && matiereMatch;
    });
    
    // Pour chaque créneau, créer une copie avec uniquement les descriptions de la date
    return creneauxFiltered.map(creneau => {
      return {
        ...creneau,
        descriptions: creneau.descriptions.filter(desc => desc.date === dateStr)
      };
    });
  }

  estJourActuel(date: Date): boolean {
    const aujourdhui = new Date();
    return date.getDate() === aujourdhui.getDate() &&
           date.getMonth() === aujourdhui.getMonth() &&
           date.getFullYear() === aujourdhui.getFullYear();
  }

  changerMois(increment: number) {
    this.moisActuel.setMonth(this.moisActuel.getMonth() + increment);
    this.genererCalendrier();
  }

  changerVue(vue: 'jour' | 'semaine' | 'mois') {
    this.vueCalendrier = vue;
    this.genererCalendrier();
  }

  allerAujourdhui() {
    this.moisActuel = new Date();
    this.genererCalendrier();
  }

  showCreneauDetails(creneau: Creneau) {
    this.selectedCreneau = creneau;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCreneau = null;
  }

  applyFilters() {
    this.genererCalendrier();
  }

  resetFilters() {
    this.filtreClasse = '';
    this.filtreProfesseur = '';
    this.filtreMatiere = '';
    this.genererCalendrier();
  }

  formatHoraire(heureDebut: string, heureFin: string): string {
    return `${heureDebut} - ${heureFin}`;
  }

  formatMonth(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  formatDate(date: Date): string {
    return date.getDate().toString();
  }

  formatFullDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // Méthodes pour l'ajout de creneau
  ouvrirModalAjouterCreneau() {
    this.showAjouterCreneau = true;
  }

  fermerModalAjouterCreneau() {
    this.showAjouterCreneau = false;
  }

  ajouterCreneau(nouveauCreneau: Creneau) {
    this.creneau.push(nouveauCreneau);
    this.genererCalendrier();
  }

  getDescriptionsForDate(creneau: Creneau, dateString: string): CreneauDescription[] {
    return creneau.descriptions.filter(desc => desc.date === dateString);
  }

  getBackgroundColor(couleur: string): string {
    return `${couleur}20`; // 20 représente une opacité de 12.5%
  }

  hasMultipleDescriptions(creneau: Creneau): boolean {
    return creneau.descriptions.length > 1;
  }
}
