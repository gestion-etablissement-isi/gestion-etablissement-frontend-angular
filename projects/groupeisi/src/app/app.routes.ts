import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ConnexionComponent } from './features/auth/components/connexion/connexion.component';
import { InscriptionComponent } from './features/auth/components/inscription/inscription.component';
import { MainComponent } from './pages/main/main.component';
import { AccueilEtudiantComponent } from './pages/etudiants/accueil-etudiant/accueil-etudiant.component';
import { AccueilProfesseursComponent } from './pages/professeurs/accueil-professeurs/accueil-professeurs.component';
import { AccueilMatieresComponent } from './pages/matieres/accueil-matieres/accueil-matieres.component';
import { AccueilEmploiDuTempsComponent } from './pages/emploi-du-temps/accueil-emploi-du-temps/accueil-emploi-du-temps.component';
import { AccueilCoursComponent } from './pages/cours/accueil-cours/accueil-cours.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccueilClassesComponent } from './pages/classes/accueil-classes/accueil-classes.component';
import { ClasseFormComponent } from './pages/classes/classe-form/classe-form.component';

export const routes: Routes = [
    {
        path: '',
        component: ConnexionComponent
    },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {
                path: 'etudiants',
                component: AccueilEtudiantComponent
            },
            {
                path: 'professeurs',
                component: AccueilProfesseursComponent
            },
            {
                path: 'classes',
                component: AccueilClassesComponent,
                children: [
                    {
                        path: 'modifier',
                        component: ClasseFormComponent
                    }
                ]
            },
            {
                path: 'matieres',
                component: AccueilMatieresComponent
            },
            {
                path: 'emploi-du-temps',
                component: AccueilEmploiDuTempsComponent
            },
            
            {
                path: 'cours',
                component: AccueilCoursComponent
            },
            {
                path: 'accueil',
                component:DashboardComponent
            },
        ]
    },
    {
        path: 'inscription',
        component: InscriptionComponent
    },
];
