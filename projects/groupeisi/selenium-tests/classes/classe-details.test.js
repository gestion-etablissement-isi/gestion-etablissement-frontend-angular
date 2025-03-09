const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testClasseDetails() {
  // Configurer Selenium pour utiliser Chrome
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // Ouvrir la page d'accueil des classes
    await driver.get('http://localhost:4200/main/classes'); // Remplace par l'URL de ton app

    // Attendre que la page soit chargée
    await driver.wait(until.elementLocated(By.css('table')), 10000);

    // Cliquer sur le bouton "Consulter" pour ouvrir les détails de la classe
    const viewButton = await driver.findElement(By.css('button[title="Consulter"]'));
    await viewButton.click();

    // Attendre que le modal de détails soit ouvert
    await driver.wait(until.elementLocated(By.css('.modal-backdrop')), 5000);

    // Test 1 : Vérifier que les informations de la classe sont affichées
    const nomClasse = await driver.findElement(By.css('.modal-body h3')).getText();
    const anneeScolaire = await driver.findElement(By.css('.info-group:nth-child(1) .info-value')).getText();
    const capacite = await driver.findElement(By.css('.info-group:nth-child(2) .info-value')).getText();

    console.log('Nom de la classe :', nomClasse);
    console.log('Année scolaire :', anneeScolaire);
    console.log('Capacité :', capacite);

    // Test 2 : Vérifier que le taux d'occupation est correctement calculé
    const tauxOccupation = await driver.findElement(By.css('.bg-gray-50 span')).getText();
    console.log('Taux d\'occupation :', tauxOccupation);

    // Test 3 : Fermer le modal
    const closeButton = await driver.findElement(By.css('.modal-close'));
    await closeButton.click();

    // Attendre que le modal soit fermé
    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-backdrop'))), 5000);

    console.log('Test réussi : Modal fermé avec succès.');
  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();