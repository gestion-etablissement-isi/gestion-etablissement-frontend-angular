const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testCoursForm() {
  // Configurer Selenium pour utiliser Chrome en mode headless
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless'))
    .build();

  try {
    // Ouvrir la page de gestion des cours
    await driver.get('http://localhost:4200/main/cours'); // Remplace par l'URL de ton app

    // Attendre que le tableau des cours soit chargé
    await driver.wait(until.elementLocated(By.css('table')), 10000);

    // Ouvrir le formulaire d'ajout de cours
    const addButton = await driver.findElement(By.css('button[title="Ajouter un cours"]'));
    await addButton.click();

    // Attendre que la modal soit affichée
    await driver.wait(until.elementLocated(By.css('.modal-backdrop')), 5000);

    // Remplir le formulaire
    const titreInput = await driver.findElement(By.css('#titre'));
    await titreInput.sendKeys('Mathématiques Avancées');

    const volumeHoraireInput = await driver.findElement(By.css('#volumeHoraire'));
    await volumeHoraireInput.sendKeys('30');

    const coefficientInput = await driver.findElement(By.css('#coefficient'));
    await coefficientInput.sendKeys('5');

    const anneeAcademiqueSelect = await driver.findElement(By.css('#anneeAcademique'));
    await anneeAcademiqueSelect.click();
    await driver.findElement(By.css('#anneeAcademique option[value="2024-2025"]')).click();

    const matiereSelect = await driver.findElement(By.css('#matiere'));
    await matiereSelect.click();
    await driver.findElement(By.css('#matiere option:nth-child(2)')).click(); // Sélectionne la première matière disponible

    const professeurSelect = await driver.findElement(By.css('#professeur'));
    await professeurSelect.click();
    await driver.findElement(By.css('#professeur option:nth-child(2)')).click(); // Sélectionne le premier professeur disponible

    const classeSelect = await driver.findElement(By.css('#classe'));
    await classeSelect.click();
    await driver.findElement(By.css('#classe option:nth-child(2)')).click(); // Sélectionne la première classe disponible

    // Vérifier les valeurs saisies
    const titreValue = await titreInput.getAttribute('value');
    const volumeHoraireValue = await volumeHoraireInput.getAttribute('value');
    const coefficientValue = await coefficientInput.getAttribute('value');
    const anneeAcademiqueValue = await anneeAcademiqueSelect.getAttribute('value');
    const matiereValue = await matiereSelect.getAttribute('value');
    const professeurValue = await professeurSelect.getAttribute('value');
    const classeValue = await classeSelect.getAttribute('value');

    assert.strictEqual(titreValue, 'Mathématiques Avancées', 'Le titre devrait être "Mathématiques Avancées"');
    assert.strictEqual(volumeHoraireValue, '30', 'Le volume horaire devrait être "30"');
    assert.strictEqual(coefficientValue, '5', 'Le coefficient devrait être "5"');
    assert.strictEqual(anneeAcademiqueValue, '2024-2025', 'L\'année académique devrait être "2024-2025"');
    assert.ok(matiereValue, 'Une matière devrait être sélectionnée');
    assert.ok(professeurValue, 'Un professeur devrait être sélectionné');
    assert.ok(classeValue, 'Une classe devrait être sélectionnée');

    console.log('Le formulaire a été rempli correctement');

    // Fermer la modal
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