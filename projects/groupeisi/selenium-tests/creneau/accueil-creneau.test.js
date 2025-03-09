const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testEmploiDuTemps() {
  // Configurer Selenium pour utiliser Chrome en mode headless
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless'))
    .build();

  try {
    // Ouvrir la page de l'emploi du temps
    await driver.get('http://localhost:4200/emploi-du-temps'); // Remplace par l'URL de ton app

    // Attendre que la page soit chargée
    await driver.wait(until.elementLocated(By.css('h1.text-2xl')), 10000);

    // Test 1 : Vérifier que le titre de la page est correct
    const pageTitle = await driver.findElement(By.css('h1.text-2xl')).getText();
    assert.strictEqual(pageTitle, 'Emploi du Temps', 'Le titre de la page devrait être "Emploi du Temps"');

    // Test 2 : Ouvrir la modal d'ajout de créneau
    const addButton = await driver.findElement(By.css('button[class*="bg-accent"]'));
    await addButton.click();

    // Attendre que la modal soit affichée
    await driver.wait(until.elementLocated(By.css('.modal-backdrop')), 5000);

    // Vérifier que la modal est visible
    const modalTitle = await driver.findElement(By.css('.modal-content h2')).getText();
    assert.strictEqual(modalTitle, 'Ajouter un créneau', 'Le titre de la modal devrait être "Ajouter un créneau"');

    // Fermer la modal
    const closeButton = await driver.findElement(By.css('.modal-close'));
    await closeButton.click();

    // Attendre que la modal soit fermée
    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal-backdrop'))), 5000);

    // Test 3 : Changer de mois dans le calendrier
    const nextMonthButton = await driver.findElement(By.css('button[aria-label="Next month"]'));
    await nextMonthButton.click();

    // Vérifier que le mois a changé
    const monthDisplay = await driver.findElement(By.css('span.text-lg')).getText();
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    assert.strictEqual(monthDisplay, nextMonth, 'Le mois devrait être le mois suivant');

    // Test 4 : Appliquer des filtres
    const classeFilter = await driver.findElement(By.css('#classe'));
    await classeFilter.click();
    await driver.findElement(By.css('#classe option:nth-child(2)')).click(); // Sélectionne la première classe disponible

    const professeurFilter = await driver.findElement(By.css('#professeur'));
    await professeurFilter.click();
    await driver.findElement(By.css('#professeur option:nth-child(2)')).click(); // Sélectionne le premier professeur disponible

    const matiereFilter = await driver.findElement(By.css('#matiere'));
    await matiereFilter.click();
    await driver.findElement(By.css('#matiere option:nth-child(2)')).click(); // Sélectionne la première matière disponible

    // Vérifier que les filtres sont appliqués
    const selectedClasse = await classeFilter.getAttribute('value');
    const selectedProfesseur = await professeurFilter.getAttribute('value');
    const selectedMatiere = await matiereFilter.getAttribute('value');

    assert.ok(selectedClasse, 'Une classe devrait être sélectionnée');
    assert.ok(selectedProfesseur, 'Un professeur devrait être sélectionné');
    assert.ok(selectedMatiere, 'Une matière devrait être sélectionnée');

    console.log('Les filtres ont été appliqués avec succès');

    // Test 5 : Réinitialiser les filtres
    const resetButton = await driver.findElement(By.css('button[class*="border-gray-300"]'));
    await resetButton.click();

    // Vérifier que les filtres sont réinitialisés
    const resetClasse = await classeFilter.getAttribute('value');
    const resetProfesseur = await professeurFilter.getAttribute('value');
    const resetMatiere = await matiereFilter.getAttribute('value');

    assert.strictEqual(resetClasse, '', 'Le filtre classe devrait être réinitialisé');
    assert.strictEqual(resetProfesseur, '', 'Le filtre professeur devrait être réinitialisé');
    assert.strictEqual(resetMatiere, '', 'Le filtre matière devrait être réinitialisé');

    console.log('Les filtres ont été réinitialisés avec succès');

  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();