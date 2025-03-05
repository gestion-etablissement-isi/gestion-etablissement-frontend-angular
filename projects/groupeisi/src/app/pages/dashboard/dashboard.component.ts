import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Cours {
  id: number;
  titre: string;
  professeur: string;
  classe: string;
  matiere: string;
  volumeHoraire: number;
  coefficient: number;
  anneeAcademique: string;
  statut: 'Actif' | 'Inactif';
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

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  classe: string;
  niveau: string;
  statut: 'Actif' | 'Inactif';
}

interface Matiere {
  id: number;
  libelle: string;
  statut: 'Actif' | 'Inactif';
}

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matiere: string;
  statut: 'Actif' | 'Inactif';
}

interface Classe {
  id: number;
  nom: string;
  sigle: string;
  anneeAcademique: string;
  capacite: number;
  effectif: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Données de statistiques
  statsEtudiants = { total: 0, actifs: 0, inactifs: 0 };
  statsClasses = { total: 0, pleines: 0, disponibles: 0 };
  statsProfesseurs = { total: 0, actifs: 0, inactifs: 0 };
  statsCours = { total: 0, actifs: 0, inactifs: 0 };

  // Tableau de bord
  etudiantsRecents: Etudiant[] = [];
  coursProchains: Creneau[] = [];
  calendrierJours: JourCalendrier[] = [];
  
  // État du calendrier
  moisActuel: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.chargerDonnees();
    this.genererCalendrier();
  }

  chargerDonnees(): void {
    // Simulation de chargement de données (à remplacer par des appels API)
    this.chargerEtudiants();
    this.chargerCours();
    this.chargerProfesseurs();
    this.chargerClasses();
    this.chargerProchainsCours();
  }

  chargerEtudiants(): void {
    // Simuler des données d'étudiants
    const etudiants: Etudiant[] = [
      { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie.dupont@example.com', telephone: '0612345678', dateNaissance: '1999-05-15', classe: 'Terminale S', niveau: 'Terminal', statut: 'Actif' },
      { id: 2, nom: 'Martin', prenom: 'Thomas', email: 'thomas.martin@example.com', telephone: '0687654321', dateNaissance: '2000-03-22', classe: 'Première ES', niveau: 'Première', statut: 'Actif' },
      { id: 3, nom: 'Petit', prenom: 'Julie', email: 'julie.petit@example.com', telephone: '0654321987', dateNaissance: '2001-11-10', classe: 'Seconde A', niveau: 'Seconde', statut: 'Actif' },
      { id: 4, nom: 'Bernard', prenom: 'Lucas', email: 'lucas.bernard@example.com', telephone: '0678912345', dateNaissance: '2000-09-08', classe: 'Terminale L', niveau: 'Terminal', statut: 'Inactif' },
      { id: 5, nom: 'Dubois', prenom: 'Emma', email: 'emma.dubois@example.com', telephone: '0698765432', dateNaissance: '1999-07-30', classe: 'Première S', niveau: 'Première', statut: 'Actif' },
    ];
    
    this.etudiantsRecents = etudiants.slice(0, 5);
    this.statsEtudiants = {
      total: etudiants.length,
      actifs: etudiants.filter(e => e.statut === 'Actif').length,
      inactifs: etudiants.filter(e => e.statut === 'Inactif').length
    };
  }

  chargerCours(): void {
    // Simuler des données de cours
    const cours: Cours[] = [
      { id: 1, titre: 'Mathématiques avancées', professeur: 'Moreau', classe: 'Terminale S', matiere: 'Mathématiques', volumeHoraire: 80, coefficient: 5, anneeAcademique: '2024-2025', statut: 'Actif' },
      { id: 2, titre: 'Physique-Chimie', professeur: 'Lambert', classe: 'Terminale S', matiere: 'Physique', volumeHoraire: 70, coefficient: 4, anneeAcademique: '2024-2025', statut: 'Actif' },
      { id: 3, titre: 'Philosophie', professeur: 'Rousseau', classe: 'Terminale L', matiere: 'Philosophie', volumeHoraire: 60, coefficient: 5, anneeAcademique: '2024-2025', statut: 'Actif' },
      { id: 4, titre: 'Histoire-Géographie', professeur: 'Durand', classe: 'Première ES', matiere: 'Histoire', volumeHoraire: 50, coefficient: 3, anneeAcademique: '2024-2025', statut: 'Inactif' },
    ];
    
    this.statsCours = {
      total: cours.length,
      actifs: cours.filter(c => c.statut === 'Actif').length,
      inactifs: cours.filter(c => c.statut === 'Inactif').length
    };
  }

  chargerProfesseurs(): void {
    // Simuler des données de professeurs
    const professeurs: Professeur[] = [
      { id: 1, nom: 'Moreau', prenom: 'Jean', email: 'jean.moreau@example.com', matiere: 'Mathématiques', statut: 'Actif' },
      { id: 2, nom: 'Lambert', prenom: 'Sophie', email: 'sophie.lambert@example.com', matiere: 'Physique', statut: 'Actif' },
      { id: 3, nom: 'Rousseau', prenom: 'Michel', email: 'michel.rousseau@example.com', matiere: 'Philosophie', statut: 'Actif' },
      { id: 4, nom: 'Durand', prenom: 'Caroline', email: 'caroline.durand@example.com', matiere: 'Histoire', statut: 'Inactif' },
    ];
    
    this.statsProfesseurs = {
      total: professeurs.length,
      actifs: professeurs.filter(p => p.statut === 'Actif').length,
      inactifs: professeurs.filter(p => p.statut === 'Inactif').length
    };
  }

  chargerClasses(): void {
    // Simuler des données de classes
    const classes: Classe[] = [
      { id: 1, nom: 'Terminale Scientifique', sigle: 'TS', anneeAcademique: '2024-2025', capacite: 30, effectif: 28 },
      { id: 2, nom: 'Première Économique et Sociale', sigle: '1ES', anneeAcademique: '2024-2025', capacite: 35, effectif: 32 },
      { id: 3, nom: 'Terminale Littéraire', sigle: 'TL', anneeAcademique: '2024-2025', capacite: 25, effectif: 20 },
      { id: 4, nom: 'Seconde A', sigle: '2A', anneeAcademique: '2024-2025', capacite: 40, effectif: 40 },
    ];
    
    this.statsClasses = {
      total: classes.length,
      pleines: classes.filter(c => c.effectif >= c.capacite).length,
      disponibles: classes.filter(c => c.effectif < c.capacite).length
    };
  }

  chargerProchainsCours(): void {
    // Simuler des créneaux de cours à venir
    const cours: Cours[] = [
      { id: 1, titre: 'Mathématiques avancées', professeur: 'Moreau', classe: 'Terminale S', matiere: 'Mathématiques', volumeHoraire: 80, coefficient: 5, anneeAcademique: '2024-2025', statut: 'Actif' },
      { id: 2, titre: 'Physique-Chimie', professeur: 'Lambert', classe: 'Terminale S', matiere: 'Physique', volumeHoraire: 70, coefficient: 4, anneeAcademique: '2024-2025', statut: 'Actif' },
      { id: 3, titre: 'Philosophie', professeur: 'Rousseau', classe: 'Terminale L', matiere: 'Philosophie', volumeHoraire: 60, coefficient: 5, anneeAcademique: '2024-2025', statut: 'Actif' },
    ];

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    
    this.coursProchains = [
      {
        id: 1,
        cours: cours[0],
        descriptions: [{
          date: now.toISOString().split('T')[0],
          salle: 'A101',
          description: 'Chapitre 5: Intégrales',
          heureDebut: '08:00',
          heureFin: '10:00'
        }],
        couleur: '#4A77B4'
      },
      {
        id: 2,
        cours: cours[1],
        descriptions: [{
          date: now.toISOString().split('T')[0],
          salle: 'B205',
          description: 'TP: Mesure de pH',
          heureDebut: '10:30',
          heureFin: '12:30'
        }],
        couleur: '#2A4C7D'
      },
      {
        id: 3,
        cours: cours[2],
        descriptions: [{
          date: tomorrow.toISOString().split('T')[0],
          salle: 'C103',
          description: 'Le concept de liberté',
          heureDebut: '14:00',
          heureFin: '16:00'
        }],
        couleur: '#041F4E'
      }
    ];
  }

  genererCalendrier(): void {
    const aujourdhui = new Date();
    const annee = this.moisActuel.getFullYear();
    const mois = this.moisActuel.getMonth();
    
    // Premier jour du mois
    const premierJour = new Date(annee, mois, 1);
    // Dernier jour du mois
    const dernierJour = new Date(annee, mois + 1, 0);
    
    // Ajuster pour commencer par le premier jour de la semaine (lundi)
    const debutAffichage = new Date(premierJour);
    debutAffichage.setDate(premierJour.getDate() - (premierJour.getDay() === 0 ? 6 : premierJour.getDay() - 1));
    
    // Ajuster pour terminer par le dernier jour de la semaine (dimanche)
    const finAffichage = new Date(dernierJour);
    finAffichage.setDate(dernierJour.getDate() + (7 - dernierJour.getDay()) % 7);
    
    this.calendrierJours = [];
    
    // Générer les jours du calendrier
    for (let d = new Date(debutAffichage); d <= finAffichage; d.setDate(d.getDate() + 1)) {
      const dateCourante = new Date(d);
      
      // Vérifier si un cours est prévu ce jour
      const creneauxJour = this.coursProchains.filter(c => 
        c.descriptions.some(desc => desc.date === dateCourante.toISOString().split('T')[0])
      );
      
      this.calendrierJours.push({
        date: new Date(dateCourante),
        creneau: creneauxJour,
        estJourActuel: dateCourante.toDateString() === aujourdhui.toDateString(),
        estMoisActuel: dateCourante.getMonth() === mois
      });
    }
  }

  moisPrecedent(): void {
    this.moisActuel.setMonth(this.moisActuel.getMonth() - 1);
    this.genererCalendrier();
  }

  moisSuivant(): void {
    this.moisActuel.setMonth(this.moisActuel.getMonth() + 1);
    this.genererCalendrier();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }
}