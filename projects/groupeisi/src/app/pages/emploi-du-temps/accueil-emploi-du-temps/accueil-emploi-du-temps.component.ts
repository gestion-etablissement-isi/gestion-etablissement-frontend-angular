import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreneauDetailsComponent } from '../creneau-details/creneau-details.component';
import { AjouterCreneauComponent } from '../ajouter-creneau/ajouter-creneau.component';
import { ICours } from '../../../interfaces/cours.interface';
import { ICreneau } from '../../../interfaces/creneau.interface';
import { IDescription } from '../../../interfaces/description.interface';
import { IClasse } from '../../../interfaces/classe.interface';
import { IProfesseur } from '../../../interfaces/professeur.interface';
import { IMatiere } from '../../../interfaces/matiere.interface';
import { MatiereService } from '../../../services/matiere/matiere.service';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { ClasseService } from '../../../services/classe/classe.service';
import { CoursService } from '../../../services/cours/cours.service';
import { DescriptionService } from '../../../services/description/description.service';
import { CreneauService } from '../../../services/creneau/creneau.service';
import { forkJoin, Observable, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

interface JourCalendrier {
  date: Date;
  creneau: ICreneau[];
  estJourActuel: boolean;
  estMoisActuel: boolean;
}

@Component({
  selector: 'app-accueil-emploi-du-temps',
  imports: [
    CommonModule,
    FormsModule,
    CreneauDetailsComponent,
    AjouterCreneauComponent,
  ],
  templateUrl: './accueil-emploi-du-temps.component.html',
  styleUrl: './accueil-emploi-du-temps.component.css',
})
export class AccueilEmploiDuTempsComponent implements OnInit {
  // Données
  descriptions: IDescription[] = [];
  description: IDescription = {
    id: '',
    dateCours: new Date(0),
    heureDebut: '',
    heureFin: '',
    description: '',
  };

  creneaux: ICreneau[] = [];
  creneau: ICreneau = { id: '', coursId: '', descriptions: [] };

  joursDuCalendrier: JourCalendrier[] = [];

  // Mappings pour les références rapides
  coursMap: { [id: string]: ICours } = {};
  classeMap: { [id: string]: IClasse } = {};
  professeurMap: { [id: string]: IProfesseur } = {};
  matiereMap: { [id: string]: IMatiere } = {};

  // Listes
  classeList: IClasse[] = [];
  professeurList: IProfesseur[] = [];
  matiereList: IMatiere[] = [];
  coursList: ICours[] = [];

  // Filtres
  filtreClasse: string = '';
  filtreProfesseur: string = '';
  filtreMatiere: string = '';

  // Gestion du calendrier
  dateActuelle: Date = new Date();
  moisActuel: Date = new Date();
  vueCalendrier: 'jour' | 'semaine' | 'mois' = 'mois';

  // Gestion des détails
  selectedCreneau: ICreneau | null = null;
  showDetails: boolean = false;

  // Gestion de l'ajout de creneau
  showAjouterCreneau: boolean = false;

  // États de chargement
  isLoading: boolean = true;

  // Jours de la semaine
  joursSemaine: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Couleurs pour les créneaux - persistent par cours
  creneauColors: { [coursId: string]: string } = {};
  colorOptions: string[] = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
    '#6200EA', '#2962FF', '#00BFA5', '#FF6D00', // Material design
    '#9C27B0', '#E91E63', '#009688', '#607D8B'  // More material colors
  ];

  constructor(
    private matiereService: MatiereService,
    private professeurService: ProfesseurService,
    private classeService: ClasseService,
    private coursService: CoursService,
    private descriptionService: DescriptionService,
    private creneauService: CreneauService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadAllData();
  }

  loadAllData() {
    // Charger toutes les données nécessaires avant de générer le calendrier
    forkJoin({
      cours: this.coursService.getAllCours(),
      classes: this.classeService.getAllClasses(),
      professeurs: this.professeurService.getAllProfesseurs(),
      matieres: this.matiereService.getAllMatieres(),
      creneaux: this.creneauService.getAllCreneaux()
    }).pipe(
      tap(results => {
        // Stocker les résultats dans les listes
        this.coursList = results.cours;
        this.classeList = results.classes;
        this.professeurList = results.professeurs;
        this.matiereList = results.matieres;
        this.creneaux = results.creneaux;

        // Créer des maps pour un accès rapide
        this.coursList.forEach(cours => {
          this.coursMap[cours.id!] = cours;
          // Assigner une couleur aléatoire à chaque cours
          if (!this.creneauColors[cours.id!]) {
            this.creneauColors[cours.id!] = this.getRandomColor();
          }
        });
        this.classeList.forEach(classe => this.classeMap[classe.id!] = classe);
        this.professeurList.forEach(prof => this.professeurMap[prof.id!] = prof);
        this.matiereList.forEach(mat => this.matiereMap[mat.id!] = mat);

        console.log('Données chargées:', {
          cours: this.coursList.length,
          classes: this.classeList.length,
          professeurs: this.professeurList.length,
          matieres: this.matiereList.length,
          creneaux: this.creneaux.length
        });
      }),
      finalize(() => {
        this.isLoading = false;
        this.genererCalendrier();
      })
    ).subscribe(
      () => {},
      (error) => {
        console.error('Erreur lors du chargement des données', error);
        this.isLoading = false;
      }
    );
  }

  getRandomColor(): string {
    return this.colorOptions[Math.floor(Math.random() * this.colorOptions.length)];
  }

  getColorForCours(coursId: string): string {
    if (!this.creneauColors[coursId]) {
      this.creneauColors[coursId] = this.getRandomColor();
    }
    return this.creneauColors[coursId];
  }

  // Méthodes synchrones pour accéder aux données mappées
  getNomClasse(coursId: string): string {
    const cours = this.coursMap[coursId];
    if (!cours) return 'Cours introuvable';
    
    const classe = this.classeMap[cours.classeId];
    return classe ? classe.nom : 'Classe introuvable';
  }

  getNomCours(coursId: string): string {
    const cours = this.coursMap[coursId];
    return cours ? cours.titre : 'Cours introuvable';
  }

  getMatiereCours(coursId: string): string {
    const cours = this.coursMap[coursId];
    if (!cours) return 'Matière introuvable';
    
    const matiere = this.matiereMap[cours.matiereId];
    return matiere ? matiere.libelle : 'Matière introuvable';
  }

  getProfesseurCours(coursId: string): string {
    const cours = this.coursMap[coursId];
    if (!cours) return 'Professeur introuvable';
    
    const prof = this.professeurMap[cours.professeurId];
    return prof ? `${prof.prenom} ${prof.nom}` : 'Professeur introuvable';
  }

  getClasseCours(coursId: string): string {
    return this.getNomClasse(coursId);
  }

  getCours(coursId: string): ICours | null {
    return this.coursMap[coursId] || null;
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
        creneau: this.getCreneauxFiltres(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: false,
      });
    }

    // Jours du mois actuel
    for (let jour = 1; jour <= dernierJour.getDate(); jour++) {
      const date = new Date(annee, mois, jour);
      this.joursDuCalendrier.push({
        date,
        creneau: this.getCreneauxFiltres(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: true,
      });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const joursRestants = 42 - this.joursDuCalendrier.length; // 6 semaines * 7 jours = 42
    for (let jour = 1; jour <= joursRestants; jour++) {
      const date = new Date(annee, mois + 1, jour);
      this.joursDuCalendrier.push({
        date,
        creneau: this.getCreneauxFiltres(date),
        estJourActuel: this.estJourActuel(date),
        estMoisActuel: false,
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
        creneau: this.getCreneauxFiltres(jourCourant),
        estJourActuel: this.estJourActuel(jourCourant),
        estMoisActuel: jourCourant.getMonth() === this.moisActuel.getMonth(),
      });
    }
  }

  genererVueJour() {
    const date = new Date(this.moisActuel);

    this.joursDuCalendrier.push({
      date,
      creneau: this.getCreneauxFiltres(date),
      estJourActuel: this.estJourActuel(date),
      estMoisActuel: true,
    });
  }

  getCreneauxFiltres(date: Date): ICreneau[] {
    const dateStr = date.toISOString().split('T')[0];

    // Filtrer les créneaux par date
    const creneauxDuJour = this.creneaux.filter(creneau => {
      return creneau.descriptions.some(desc => {
        // Comparer les dates sans les heures
        const descDate = new Date(desc.dateCours);
        return (
          descDate.getFullYear() === date.getFullYear() &&
          descDate.getMonth() === date.getMonth() &&
          descDate.getDate() === date.getDate()
        );
      });
    });

    // Appliquer les filtres utilisateur
    return creneauxDuJour
      .filter(creneau => {
        // Si aucun filtre n'est appliqué, retourner tous les créneaux
        if (!this.filtreClasse && !this.filtreProfesseur && !this.filtreMatiere) {
          return true;
        }

        const cours = this.coursMap[creneau.coursId];
        if (!cours) return false;

        // Appliquer les filtres
        let passeFiltre = true;

        // Filtre par classe
        if (this.filtreClasse && passeFiltre) {
          const classe = this.classeMap[cours.classeId];
          passeFiltre = classe && classe.nom === this.filtreClasse;
        }

        // Filtre par professeur
        if (this.filtreProfesseur && passeFiltre) {
          const prof = this.professeurMap[cours.professeurId];
          passeFiltre = prof && `${prof.prenom} ${prof.nom}` === this.filtreProfesseur;
        }

        // Filtre par matière
        if (this.filtreMatiere && passeFiltre) {
          const matiere = this.matiereMap[cours.matiereId];
          passeFiltre = matiere && matiere.libelle === this.filtreMatiere;
        }

        return passeFiltre;
      })
      // Pour chaque créneau, ne garder que les descriptions pour cette date
      .map(creneau => {
        return {
          ...creneau,
          descriptions: creneau.descriptions.filter(desc => {
            const descDate = new Date(desc.dateCours);
            return (
              descDate.getFullYear() === date.getFullYear() &&
              descDate.getMonth() === date.getMonth() &&
              descDate.getDate() === date.getDate()
            );
          })
        };
      });
  }

  estJourActuel(date: Date): boolean {
    const aujourdhui = this.dateActuelle;
    return (
      date.getDate() === aujourdhui.getDate() &&
      date.getMonth() === aujourdhui.getMonth() &&
      date.getFullYear() === aujourdhui.getFullYear()
    );
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

  showCreneauDetails(creneau: ICreneau) {
    console.log('Créneau sélectionné :', creneau);
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

  formatMonth(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  formatDate(date: Date): string {
    return date.getDate().toString();
  }

  formatFullDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  // Méthodes pour l'ajout de creneau
  ouvrirModalAjouterCreneau() {
    this.showAjouterCreneau = true;
  }

  fermerModalAjouterCreneau() {
    this.showAjouterCreneau = false;
  }

  ajouterCreneau(nouveauCreneau: ICreneau) {
    this.creneauService.ajouterCreneau(nouveauCreneau).subscribe(
      (creneau) => {
        this.creneaux.push(creneau);
        this.genererCalendrier();
        this.fermerModalAjouterCreneau();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du créneau', error);
      }
    );
  }
}