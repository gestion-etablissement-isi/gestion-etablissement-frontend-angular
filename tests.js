const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Test Gestion des Classes', function() {
  let driver;
  const TIMEOUT = 10000;

  before(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options()
        .addArguments('--headless')
        .addArguments('--disable-gpu')
        .addArguments('--window-size=1920,1080'))
      .build();
  });

  after(async () => await driver.quit());

  describe('CRUD Classes', () => {
    it('Ajouter une classe', async () => {
      await driver.get('http://localhost:4200/classes');
      
      // Ouvrir le formulaire
      await driver.findElement(By.css('button.btn-primary')).click();
      
      // Remplir les champs
      await driver.findElement(By.id('nom')).sendKeys('Classe Test');
      await driver.findElement(By.id('annee_scolaire')).sendKeys('2024-2025');
      await driver.findElement(By.id('capacite')).sendKeys('30');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Test")]')), TIMEOUT);
      const classe = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]'));
      assert.equal(await classe.getText(), 'Classe Test');
    });

    it('Editer une classe', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.edit-btn')).click();
      
      // Modifier le nom
      const nomInput = await driver.findElement(By.id('nom'));
      await nomInput.clear();
      await nomInput.sendKeys('Classe Modifiée');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Modifier")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Modifiée")]')), TIMEOUT);
    });

    it('Supprimer une classe', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Modifiée")]/..'));
      await classeRow.findElement(By.css('.delete-btn')).click();
      
      // Confirmer la suppression
      await driver.switchTo().alert().accept();
      
      // Vérification de disparition
      await driver.wait(async () => {
        return !(await driver.findElements(By.xpath('//td[contains(text(), "Classe Modifiée")]'))).length;
      }, TIMEOUT);
    });
  });

  describe('Validation des formulaires', () => {
    it('Vérifier les messages d\'erreur', async () => {
      await driver.findElement(By.css('button.btn-primary')).click();
      
      // Soumettre formulaire vide
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter")]')).click();
      
      // Vérifier les erreurs
      const erreurs = await driver.findElements(By.css('.input-error'));
      assert.equal(erreurs.length, 3);
    });
  });
});

describe('Détails de Classe', () => {
    it('Vérifier les informations de la classe', async () => {
      // Préparation : Créer une classe test
      await driver.get('http://localhost:4200/classes');
      await driver.findElement(By.css('button.bg-primary')).click();
      await driver.findElement(By.id('nom')).sendKeys('Classe Test');
      await driver.findElement(By.id('annee_scolaire')).sendKeys('2024-2025');
      await driver.findElement(By.id('capacite')).sendKeys('30');
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter")]')).click();
      
      // Ouvrir les détails
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.view-btn')).click();
      
      // Vérifications
      const modal = await driver.findElement(By.css('.modal-content'));
      
      // Titre
      const titre = await modal.findElement(By.xpath('.//h3[text()="Classe Test"]'));
      assert.equal(await titre.getText(), 'Classe Test');
      
      // Année scolaire
      const annee = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][1]'));
      assert.equal(await annee.findElement(By.css('.info-value')).getText(), '2024-2025');
      
      // Capacité
      const capacite = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][2]'));
      assert.equal(await capacite.findElement(By.css('.info-value')).getText(), '30 élèves');
      
      // Taux d'occupation
      const occupation = await modal.findElement(By.css('.bg-gray-50'));
      const barre = await occupation.findElement(By.css('.rounded-full'));
      const pourcentage = await occupation.findElement(By.css('.text-gray-700'));
      
      assert.equal(await barre.getCssValue('width'), '0%'); // Aucun étudiant inscrit
      assert.equal(await pourcentage.getText(), '0/30 (0%)');
    });
  
    it('Vérifier la couleur de la barre d\'occupation', async () => {
      // Simuler un taux d'occupation de 85%
      // (Ajoutez des étudiants via l'UI ou via mock si possible)
      
      // Ouvrir les détails
      await driver.findElement(By.css('.view-btn')).click();
      const barre = await driver.findElement(By.css('.rounded-full'));
      
      // Vérifier la couleur jaune
      const bgColor = await barre.getCssValue('background-color');
      assert.equal(bgColor, 'rgba(234, 179, 8, 1)'); // Couleur Tailwind yellow-500
    });
});

describe('Formulaire de Classe', () => {
    let driver;
    const TIMEOUT = 10000;
  
    before(async () => {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build();
    });
  
    after(async () => await driver.quit());
  
    describe('Ajout de Classe', () => {
      it('Formulaire valide', async () => {
        await driver.get('http://localhost:4200/classes');
        await driver.findElement(By.css('button.bg-primary')).click();
        
        // Remplir le formulaire
        await driver.findElement(By.id('nom')).sendKeys('Classe Test');
        const anneeSelect = await driver.findElement(By.id('anneeScolaire'));
        await anneeSelect.sendKeys('2024-2025');
        await driver.findElement(By.id('capacite')).sendKeys('30');
        await driver.findElement(By.id('effectif')).sendKeys('25');
        
        // Soumettre
        await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
        
        // Vérification
        await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Test")]')), TIMEOUT);
        const effectif = await driver.findElement(By.xpath('//td[contains(text(), "25/30")]'));
        assert.equal(await effectif.getText(), '25/30');
      });
    });
  
    describe('Validation des erreurs', () => {
      it('Champs obligatoires manquants', async () => {
        await driver.findElement(By.css('button.bg-primary')).click();
        
        // Soumettre formulaire vide
        await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
        
        // Vérifier les erreurs
        const erreurs = await driver.findElements(By.css('.error-message'));
        assert.equal(erreurs.length, 3);
        assert.equal(await erreurs[0].getText(), 'Le nom est requis');
        assert.equal(await erreurs[1].getText(), "L'année scolaire est requise");
        assert.equal(await erreurs[2].getText(), 'La capacité doit être supérieure à 0');
      });
  
      it('Capacité invalide', async () => {
        await driver.findElement(By.id('capacite')).sendKeys('-5');
        await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
        const erreur = await driver.findElement(By.css('.error-message'));
        assert.equal(await erreur.getText(), 'La capacité doit être supérieure à 0');
      });
    });
  
    describe('Édition de Classe', () => {
      it('Modification des informations', async () => {
        const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
        await classeRow.findElement(By.css('.edit-btn')).click();
        
        // Modifier les valeurs
        const nomInput = await driver.findElement(By.id('nom'));
        await nomInput.clear();
        await nomInput.sendKeys('Classe Modifiée');
        await driver.findElement(By.id('effectif')).clear();
        await driver.findElement(By.id('effectif')).sendKeys('28');
        
        // Soumettre
        await driver.findElement(By.xpath('//button[contains(text(), "Modifier")]')).click();
        
        // Vérification
        await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Modifiée")]')), TIMEOUT);
        const effectif = await driver.findElement(By.xpath('//td[contains(text(), "28/30")]'));
        assert.equal(await effectif.getText(), '28/30');
      });
    });
  
    describe('Interactions du modal', () => {
      it('Fermeture via le bouton Annuler', async () => {
        await driver.findElement(By.css('button.bg-primary')).click();
        await driver.findElement(By.css('.close-btn')).click();
        await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-content'))), TIMEOUT);
      });
    });
});

describe('Tests HMI Gestion des Classes', function() {
  let driver;
  const TIMEOUT = 10000;

  before(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options()
        .addArguments('--headless')
        .addArguments('--disable-gpu')
        .addArguments('--window-size=1920,1080'))
      .build();
  });

  after(async () => await driver.quit());

  describe('Formulaire de Classe', () => {
    it('Ajout de classe avec données valides', async () => {
      await driver.get('http://localhost:4200/classes');
      
      // Ouvrir le formulaire
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Remplir les champs
      await driver.findElement(By.id('nom')).sendKeys('Classe Test');
      await driver.findElement(By.id('anneeScolaire')).sendKeys('2024-2025');
      await driver.findElement(By.id('capacite')).sendKeys('30');
      await driver.findElement(By.id('effectif')).sendKeys('25');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Test")]')), TIMEOUT);
      const effectif = await driver.findElement(By.xpath('//td[contains(text(), "25/30")]'));
      assert.equal(await effectif.getText(), '25/30');
    });

    it('Validation des erreurs de formulaire', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Soumettre formulaire vide
      await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
      
      // Vérifier les erreurs
      const erreurs = await driver.findElements(By.css('.error-message'));
      assert.equal(erreurs.length, 3);
      assert.equal(await erreurs[0].getText(), 'Le nom est requis');
      assert.equal(await erreurs[1].getText(), "L'année scolaire est requise");
      assert.equal(await erreurs[2].getText(), 'La capacité doit être supérieure à 0');
    });
  });

  describe('Détails de Classe', () => {
    it('Vérification des informations', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.view-btn')).click();
      
      const modal = await driver.findElement(By.css('.modal-content'));
      
      // Vérifier les informations principales
      const nom = await modal.findElement(By.xpath('.//h3[text()="Classe Test"]'));
      assert.equal(await nom.getText(), 'Classe Test');
      
      const annee = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][1]'));
      assert.equal(await annee.findElement(By.css('.info-value')).getText(), '2024-2025');
      
      const capacite = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][2]'));
      assert.equal(await capacite.findElement(By.css('.info-value')).getText(), '30 élèves');
    });

    it('Vérification de la barre d\'occupation', async () => {
      const modal = await driver.findElement(By.css('.modal-content'));
      const occupationBar = await modal.findElement(By.css('.rounded-full'));
      
      // Vérifier la couleur (25/30 = 83% → jaune)
      const bgColor = await occupationBar.getCssValue('background-color');
      assert.equal(bgColor, 'rgba(234, 179, 8, 1)'); // Couleur Tailwind yellow-500
      
      // Vérifier le texte
      const pourcentageText = await modal.findElement(By.css('.text-gray-700')).getText();
      assert.equal(pourcentageText, '25/30 (83%)');
    });
  });

  describe('Édition de Classe', () => {
    it('Modification des informations', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.edit-btn')).click();
      
      // Modifier les valeurs
      const nomInput = await driver.findElement(By.id('nom'));
      await nomInput.clear();
      await nomInput.sendKeys('Classe Modifiée');
      await driver.findElement(By.id('effectif')).clear();
      await driver.findElement(By.id('effectif')).sendKeys('28');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Modifier")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Modifiée")]')), TIMEOUT);
      const effectif = await driver.findElement(By.xpath('//td[contains(text(), "28/30")]'));
      assert.equal(await effectif.getText(), '28/30');
    });
  });

  describe('Interactions Modales', () => {
    it('Fermeture via le bouton Annuler', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      await driver.findElement(By.css('.close-btn')).click();
      await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-content'))), TIMEOUT);
    });

    it('Fermeture en cliquant en dehors du modal', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      await driver.findElement(By.css('.modal-backdrop')).click();
      await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-content'))), TIMEOUT);
    });
  });
});

describe('Détails du Cours', () => {
    let driver;
    const TIMEOUT = 10000;
  
    before(async () => {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build();
    });
  
    after(async () => await driver.quit());
  
    it('Affichage des informations du cours', async () => {
      // Préparation : Créer un cours test
      await driver.get('http://localhost:4200/cours');
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Remplir le formulaire de cours
      await driver.findElement(By.id('titre')).sendKeys('Mathématiques');
      await driver.findElement(By.id('volumeHoraire')).sendKeys('60');
      await driver.findElement(By.id('coefficient')).sendKeys('4');
      await driver.findElement(By.id('anneeAcademique')).sendKeys('2023-2024');
      
      // Sélectionner les listes déroulantes
      await driver.findElement(By.id('matiereId')).sendKeys('Analyse');
      await driver.findElement(By.id('professeurId')).sendKeys('John Doe');
      await driver.findElement(By.id('classeId')).sendKeys('Classe Test');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter le cours")]')).click();
      
      // Ouvrir les détails
      const coursRow = await driver.findElement(By.xpath('//td[contains(text(), "Mathématiques")]/..'));
      await coursRow.findElement(By.css('.view-btn')).click();
      
      // Vérifications
      const modal = await driver.findElement(By.css('.modal-content'));
      
      // Vérifier les informations
      const matiere = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Matière"]//p'));
      assert.equal(await matiere.getText(), 'Analyse');
      
      const professeur = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Professeur"]//p'));
      assert.equal(await professeur.getText(), 'John Doe');
      
      const classe = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Classe"]//p'));
      assert.equal(await classe.getText(), 'Classe Test');
      
      const volume = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Volume Horaire"]//p'));
      assert.equal(await volume.getText(), '60');
      
      const coefficient = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Coefficient"]//p'));
      assert.equal(await coefficient.getText(), '4');
      
      const annee = await modal.findElement(By.xpath('.//div[@class="info-group"][.//h4="Annee académique"]//p'));
      assert.equal(await annee.getText(), '2023-2024');
    });
  
    it('Fermeture via le bouton Fermer', async () => {
      const modal = await driver.findElement(By.css('.modal-content'));
      await modal.findElement(By.xpath('.//button[contains(text(), "Fermer")]')).click();
      await driver.wait(until.stalenessOf(modal), TIMEOUT);
    });
  
    it('Fermeture via le bouton croix', async () => {
      // Ré-ouvrir le modal
      const coursRow = await driver.findElement(By.xpath('//td[contains(text(), "Mathématiques")]/..'));
      await coursRow.findElement(By.css('.view-btn')).click();
      
      const modal = await driver.findElement(By.css('.modal-content'));
      await modal.findElement(By.css('.modal-close')).click();
      await driver.wait(until.stalenessOf(modal), TIMEOUT);
    });
  
    it('Bouton Modifier présent', async () => {
      // Ré-ouvrir le modal
      const coursRow = await driver.findElement(By.xpath('//td[contains(text(), "Mathématiques")]/..'));
      await coursRow.findElement(By.css('.view-btn')).click();
      
      const modifierBtn = await driver.findElement(By.xpath('//button[contains(text(), "Modifier")]'));
      assert.equal(await modifierBtn.isDisplayed(), true);
    });
});

describe('Test du Formulaire de Cours', function() {
  let driver;
  const TIMEOUT = 10000;

  before(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options()
        .addArguments('--headless')
        .addArguments('--disable-gpu')
        .addArguments('--window-size=1920,1080'))
      .build();
  });

  after(async () => await driver.quit());

  describe('Ajout de cours', () => {
    it('Formulaire valide', async () => {
      await driver.get('http://localhost:4200/cours');
      
      // Ouvrir le formulaire
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Remplir les champs
      await driver.findElement(By.id('titre')).sendKeys('Mathématiques');
      await driver.findElement(By.id('volumeHoraire')).sendKeys('60');
      await driver.findElement(By.id('coefficient')).sendKeys('4');
      await driver.findElement(By.id('anneeAcademique')).sendKeys('2024-2025');
      
      // Sélectionner les listes déroulantes
      const matiereSelect = await driver.findElement(By.id('matiere'));
      await matiereSelect.sendKeys('Analyse');
      
      const profSelect = await driver.findElement(By.id('professeur'));
      await profSelect.sendKeys('John Doe');
      
      const classeSelect = await driver.findElement(By.id('classe'));
      await classeSelect.sendKeys('Classe Test');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter le cours")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Mathématiques")]')), TIMEOUT);
      const cours = await driver.findElement(By.xpath('//td[contains(text(), "Mathématiques")]'));
      assert.equal(await cours.getText(), 'Mathématiques');
    });
  });

  describe('Validation des erreurs', () => {
    it('Champs obligatoires manquants', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Soumettre formulaire vide
      await driver.findElement(By.xpath('//button[contains(text(), "Ajouter le cours")]')).click();
      
      // Vérifier les erreurs
      const erreurs = await driver.findElements(By.css('.form-input:invalid, .form-select:invalid'));
      assert.equal(erreurs.length, 7); // 7 champs obligatoires
    });
  });

  describe('Édition de cours', () => {
    it('Modification des informations', async () => {
      const coursRow = await driver.findElement(By.xpath('//td[contains(text(), "Mathématiques")]/..'));
      await coursRow.findElement(By.css('.edit-btn')).click();
      
      // Modifier les valeurs
      const titreInput = await driver.findElement(By.id('titre'));
      await titreInput.clear();
      await titreInput.sendKeys('Mathématiques Avancées');
      
      await driver.findElement(By.id('volumeHoraire')).clear();
      await driver.findElement(By.id('volumeHoraire')).sendKeys('70');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Modifier le cours")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Mathématiques Avancées")]')), TIMEOUT);
    });
  });

  describe('Interactions du modal', () => {
    it('Fermeture via le bouton Annuler', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      await driver.findElement(By.css('.btn-secondary')).click();
      await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-content'))), TIMEOUT);
    });

    it('Fermeture via le bouton croix', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      await driver.findElement(By.css('.modal-close')).click();
      await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-content'))), TIMEOUT);
    });
  });
});

describe('Tests HMI Gestion des Classes', function() {
  let driver;
  const TIMEOUT = 10000;

  before(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options()
        .addArguments('--headless')
        .addArguments('--disable-gpu')
        .addArguments('--window-size=1920,1080'))
      .build();
  });

  after(async () => await driver.quit());

  describe('Gestion des Classes', () => {
    it('Ajouter une classe avec données valides', async () => {
      await driver.get('http://localhost:4200/classes');
      
      // Ouvrir le formulaire
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Remplir les champs
      await driver.findElement(By.id('nom')).sendKeys('Classe Test');
      const anneeSelect = await driver.findElement(By.id('anneeScolaire'));
      await anneeSelect.sendKeys('2024-2025');
      await driver.findElement(By.id('capacite')).sendKeys('30');
      await driver.findElement(By.id('effectif')).sendKeys('25');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Test")]')), TIMEOUT);
      const effectif = await driver.findElement(By.xpath('//td[contains(text(), "25/30")]'));
      assert.equal(await effectif.getText(), '25/30');
    });

    it('Validation des erreurs de formulaire', async () => {
      await driver.findElement(By.css('button.bg-primary')).click();
      
      // Soumettre formulaire vide
      await driver.findElement(By.xpath('//button[contains(text(), "Enregistrer")]')).click();
      
      // Vérifier les erreurs
      const erreurs = await driver.findElements(By.css('.error-message'));
      assert.equal(erreurs.length, 3);
      assert.equal(await erreurs[0].getText(), 'Le nom est requis');
      assert.equal(await erreurs[1].getText(), "L'année scolaire est requise");
      assert.equal(await erreurs[2].getText(), 'La capacité doit être supérieure à 0');
    });

    it('Vérification des détails de classe', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.view-btn')).click();
      
      const modal = await driver.findElement(By.css('.modal-content'));
      
      // Vérifier les informations principales
      const nom = await modal.findElement(By.xpath('.//h3[text()="Classe Test"]'));
      assert.equal(await nom.getText(), 'Classe Test');
      
      const annee = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][1]'));
      assert.equal(await annee.findElement(By.css('.info-value')).getText(), '2024-2025');
      
      const capacite = await modal.findElement(By.xpath('.//div[contains(@class, "info-group")][2]'));
      assert.equal(await capacite.findElement(By.css('.info-value')).getText(), '30 élèves');
    });

    it('Édition des informations de classe', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Test")]/..'));
      await classeRow.findElement(By.css('.edit-btn')).click();
      
      // Modifier les valeurs
      const nomInput = await driver.findElement(By.id('nom'));
      await nomInput.clear();
      await nomInput.sendKeys('Classe Modifiée');
      await driver.findElement(By.id('effectif')).clear();
      await driver.findElement(By.id('effectif')).sendKeys('28');
      
      // Soumettre
      await driver.findElement(By.xpath('//button[contains(text(), "Modifier")]')).click();
      
      // Vérification
      await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Classe Modifiée")]')), TIMEOUT);
      const effectif = await driver.findElement(By.xpath('//td[contains(text(), "28/30")]'));
      assert.equal(await effectif.getText(), '28/30');
    });

    it('Suppression d\'une classe', async () => {
      const classeRow = await driver.findElement(By.xpath('//td[contains(text(), "Classe Modifiée")]/..'));
      await classeRow.findElement(By.css('.delete-btn')).click();
      
      // Confirmer la suppression
      await driver.switchTo().alert().accept();
      
      // Vérification de disparition
      await driver.wait(async () => {
        return !(await driver.findElements(By.xpath('//td[contains(text(), "Classe Modifiée")]'))).length;
      }, TIMEOUT);
    });
  });
});