const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testClasseForm() {
  // Configurer Selenium pour utiliser Chrome
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // Ouvrir la page où se trouve le formulaire de classe
    await driver.get('http://localhost:4200/main/classes'); // Remplace par l'URL de ton app

    // Attendre que le modal soit ouvert (simule un clic sur "Ajouter une classe")
    await driver.wait(until.elementLocated(By.css('.modal')), 5000);

    // Remplir le formulaire
    await driver.findElement(By.css('input[name="nom"]')).sendKeys('Classe de Test');
    await driver.findElement(By.css('select[name="anneeScolaire"]')).sendKeys('2023-2024');
    await driver.findElement(By.css('input[name="capacite"]')).sendKeys('30');
    await driver.findElement(By.css('input[name="effectif"]')).sendKeys('25');

    // Soumettre le formulaire
    await driver.findElement(By.css('.btn-primary')).click();

    // Attendre que le modal se ferme (simule une redirection ou un message de succès)
    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);

    console.log('Test réussi : Formulaire soumis avec succès.');
  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();

(async function testClasseFormValidation() {
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();
  
    try {
      // Ouvrir la page où se trouve le formulaire de classe
      await driver.get('http://localhost:4200/main/classes');
  
      // Attendre que le modal soit ouvert
      await driver.wait(until.elementLocated(By.css('.modal')), 5000);
  
      // Ne pas remplir le formulaire et cliquer sur "Enregistrer"
      await driver.findElement(By.css('.btn-primary')).click();
  
      // Vérifier que les messages d'erreur s'affichent
      await driver.wait(until.elementLocated(By.css('.error-message')), 5000);
  
      const nomError = await driver.findElement(By.css('input[name="nom"] + .error-message')).getText();
      const anneeError = await driver.findElement(By.css('select[name="anneeScolaire"] + .error-message')).getText();
      const capaciteError = await driver.findElement(By.css('input[name="capacite"] + .error-message')).getText();
  
      if (nomError === 'Le nom est requis' && anneeError === "L'année scolaire est requise" && capaciteError === 'La capacité doit être supérieure à 0') {
        console.log('Test réussi : Messages d\'erreur affichés correctement.');
      } else {
        console.error('Test échoué : Messages d\'erreur incorrects.');
      }
    } catch (error) {
      console.error('Test échoué :', error);
    } finally {
      await driver.quit();
    }
  })();

  (async function testClasseFormClose() {
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();
  
    try {
      // Ouvrir la page où se trouve le formulaire de classe
      await driver.get('http://localhost:4200/main/classes');
  
      // Attendre que le modal soit ouvert
      await driver.wait(until.elementLocated(By.css('.modal')), 5000);
  
      // Cliquer sur le bouton "Annuler"
      await driver.findElement(By.css('.btn-secondary')).click();
  
      // Attendre que le modal se ferme
      await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);
  
      console.log('Test réussi : Modal fermé avec succès.');
    } catch (error) {
      console.error('Test échoué :', error);
    } finally {
      await driver.quit();
    }
  })();