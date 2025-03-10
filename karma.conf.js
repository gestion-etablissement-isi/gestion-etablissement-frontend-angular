module.exports = function(config) {
    config.set({
      // Chemin vers les fichiers de tests et sources
      basePath: '',
      frameworks: ['jasmine'], // Framework de test, ici Jasmine
      plugins: [
        'karma-jasmine',
        'karma-chrome-launcher', // Pour lancer le navigateur Chrome
        'karma-coverage',         // Pour obtenir la couverture de code
        'karma-jasmine-html-reporter' // Pour un rapport HTML interactif
      ],
  
      // Les fichiers à charger pour le test
      files: [
        'src/test.ts',  // Le fichier principal pour tes tests
        { pattern: 'src/**/*.spec.ts', watched: false }, // Charge les fichiers de tests (.spec.ts)
      ],
  
      // Les fichiers à exclure
      exclude: [],
  
      // Préprocesseurs de fichiers
      preprocessors: {
        'src/**/*.ts': ['karma-typescript', 'coverage'] // Prise en charge des fichiers TypeScript et génération de la couverture
      },
  
      // Le serveur de couverture
      coverageReporter: {
        dir: 'coverage/',  // Dossier où les rapports de couverture seront enregistrés
        reporters: [
          { type: 'html', subdir: 'report-html' },  // Rapport HTML
          { type: 'lcov', subdir: 'report-lcov' },  // Rapport LCOV
          { type: 'text-summary' }  // Résumé dans la console
        ]
      },
  
      // Reporter pour les résultats de tests
      reporters: ['progress', 'kjhtml'],  // Affiche le progrès dans la console et un rapport HTML
  
      // Port du serveur de tests
      port: 9876,
  
      // Niveau de log
      logLevel: config.LOG_INFO,
  
      // Couleurs dans la console
      colors: true,
  
      // Activer ou désactiver les fenêtres de débogage
      autoWatch: true,
  
      // Lancer les tests dès que les fichiers sont modifiés
      autoWatchBatchDelay: 500,  // Délai en ms pour regrouper les changements
  
      // Configurer les navigateurs
      browsers: ['Chrome'],  // Tu peux aussi utiliser d'autres navigateurs comme Firefox
  
      // Lancer les tests en continu
      singleRun: false,  // Mettre à true pour exécuter une seule fois et arrêter
  
      // Concurrency (nombre de navigateurs à lancer simultanément)
      concurrency: Infinity
    });
  };
  