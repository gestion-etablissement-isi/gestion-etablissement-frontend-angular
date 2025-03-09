const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testCreneauDetails() {
  let driver;

  try {
    // Configuration du driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--start-maximized'))
      .build();

    // 1. Accès à la page contenant les créneaux
    await driver.get('http://localhost:4200/creneaux'); // Ajuster selon votre routing

    // 2. Ouvrir le modal de détails
    const detailsButton = await driver.findElement(By.css('button[title="Consulter"]'));
    await detailsButton.click();

    // 3. Attendre l'ouverture du modal
    const modal = await driver.wait(until.elementLocated(By.css('.fixed.inset-0')), 5000);
    const modalContent = await driver.wait(until.elementLocated(By.css('.max-w-xl')), 3000);

    // 4. Vérification des informations générales
    const titreCours = await modalContent.findElement(By.css('h2.text-2xl')).getText();
    const matiere = await modalContent.findElement(By.css('p.text-gray-600')).getText();
    console.log(`Cours : ${titreCours} - Matière : ${matiere}`);

    // Vérification des détails du cours
    const classe = await modalContent.findElement(By.css('.grid-cols-2 div:first-child p.font-medium')).getText();
    const professeur = await modalContent.findElement(By.css('.grid-cols-2 div:nth-child(2) p.font-medium')).getText();
    const volumeHoraire = await modalContent.findElement(By.css('.grid-cols-2 div:nth-child(3) p.font-medium')).getText();
    const coefficient = await modalContent.findElement(By.css('.grid-cols-2 div:last-child p.font-medium')).getText();
    
    assert.strictEqual(classe, 'Classe Test'); // Remplacer par valeur attendue
    assert.strictEqual(professeur, 'Professeur Test');
    assert.strictEqual(volumeHoraire, '42 heures');
    assert.strictEqual(coefficient, '3');

    // 5. Vérification des séances
    const seances = await modalContent.findElements(By.css('.border.rounded-lg'));
    assert.strictEqual(seances.length, 2, 'Nombre de séances incorrect');

    // Vérification détails première séance
    const premiereSeance = seances[0];
    const date = await premiereSeance.findElement(By.css('span.font-medium')).getText();
    const horaire = await premiereSeance.findElement(By.css('svg:nth-child(2) + span')).getText();
    const description = await premiereSeance.findElement(By.css('p.text-gray-700')).getText();
    
    assert.strictEqual(date, '15 janvier 2024'); // Format attendu selon formatDate()
    assert.strictEqual(horaire, '08:00 - 10:00');
    assert.strictEqual(description, 'Cours de présentation');

    // 6. Vérification de la couleur aléatoire
    const headerColor = await modalContent.getCssValue('border-top-color');
    const validColors = ['rgb(255, 255, 0)', 'rgb(128, 0, 128)', 'rgb(0, 0, 139)', 
                        'rgb(0, 128, 0)', 'rgb(255, 0, 0)', 'rgb(255, 165, 0)',
                        'rgb(255, 192, 203)', 'rgb(0, 128, 128)', 'rgb(165, 42, 42)'];
    assert.ok(validColors.includes(headerColor), `Couleur invalide : ${headerColor}`);

    // 7. Test fermeture via bouton
    const closeButton = await modalContent.findElement(By.css('button[aria-label="Close"]'));
    await closeButton.click();
    await driver.wait(until.stalenessOf(modal), 3000);
    
    // 8. Ré-ouverture et test fermeture via backdrop
    await detailsButton.click();
    await driver.wait(until.elementLocated(By.css('.fixed.inset-0')), 3000);
    await driver.findElement(By.css('.fixed.inset-0')).click();
    await driver.wait(until.stalenessOf(modal), 3000);

    // 9. Test bouton modifier (si autorisé)
    if (await driver.findElement(By.css('button.bg-accent')).isDisplayed()) {
      const modifierButton = await modalContent.findElement(By.css('button.bg-accent'));
      await modifierButton.click();
      // Ajouter ici les vérifications post-modification
    }

  } catch (error) {
    console.error('Erreur lors du test :', error);
    throw error;
  } finally {
    if (driver) await driver.quit();
  }
})();