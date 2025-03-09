const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testCoursDetails() {
  // Configurer Selenium pour utiliser Chrome
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // Ouvrir la page de gestion des cours
    await driver.get('http://localhost:4200/main/cours'); // Remplace par l'URL de ton app

    // Attendre que le tableau des cours soit chargé
    await driver.wait(until.elementLocated(By.css('table')), 10000); // Attend jusqu'à 10 secondes

    // Ouvrir les détails d'un cours
    const detailsButton = await driver.findElement(By.css('button[title="Consulter"]'));
    await detailsButton.click();

    // Attendre que la modal des détails soit affichée
    await driver.wait(until.elementLocated(By.css('.modal-backdrop')), 5000);

    // Test 1 : Vérifier que les détails du cours sont affichés
    const matiere = await driver.findElement(By.css('.info-group:nth-child(1) .info-value')).getText();
    const professeur = await driver.findElement(By.css('.info-group:nth-child(2) .info-value')).getText();
    const classe = await driver.findElement(By.css('.info-group:nth-child(3) .info-value')).getText();
    const volumeHoraire = await driver.findElement(By.css('.info-group:nth-child(4) .info-value')).getText();
    const coefficient = await driver.findElement(By.css('.info-group:nth-child(5) .info-value')).getText();
    const anneeAcademique = await driver.findElement(By.css('.info-group:nth-child(6) .info-value')).getText();

    console.log(`Matière : ${matiere}`);
    console.log(`Professeur : ${professeur}`);
    console.log(`Classe : ${classe}`);
    console.log(`Volume Horaire : ${volumeHoraire}`);
    console.log(`Coefficient : ${coefficient}`);
    console.log(`Année académique : ${anneeAcademique}`);

    // Test 2 : Fermer la modal
    const closeButton = await driver.findElement(By.css('.modal-close'));
    await closeButton.click();

    // Attendre que la modal soit fermée
    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-backdrop'))), 5000);

    console.log('La modal a été fermée avec succès');

  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();