const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testAjoutCreneau() {
  let driver;

  try {
    // Configuration du driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--start-maximized'))
      .build();

    // 1. Accès à la page de gestion des créneaux
    await driver.get('http://localhost:4200'); // Ajuster l'URL selon votre routing

    // 2. Ouvrir le modal d'ajout (rechercher le bouton d'ajout)
    const openModalBtn = await driver.findElement(By.css('button[aria-label="Ajouter un créneau"]'));
    await openModalBtn.click();

    // 3. Attendre l'ouverture du modal
    const modal = await driver.wait(until.elementLocated(By.css('.modal-content')), 5000);

    // 4. Sélectionner un cours
    const coursSelect = await modal.findElement(By.id('cours'));
    await coursSelect.click();
    
    // Attendre le chargement des options
    const firstOption = await driver.wait(
      until.elementLocated(By.css('#cours option:not([disabled])')),
      3000
    );
    await firstOption.click();

    // 5. Remplir la première description
    const premiereDescription = await modal.findElement(By.css('.description-card:first-child'));
    
    // Date
    const dateInput = await premiereDescription.findElement(By.css('input[type="date"]'));
    await dateInput.sendKeys('2024-01-15');
    
    // Heures
    const heureDebut = await premiereDescription.findElement(By.css('input[type="time"]:first-child'));
    await heureDebut.sendKeys('08:00');
    const heureFin = await premiereDescription.findElement(By.css('input[type="time"]:last-child'));
    await heureFin.sendKeys('10:00');
    
    // Texte de description
    const textArea = await premiereDescription.findElement(By.css('textarea'));
    await textArea.sendKeys('Cours de présentation');

    // 6. Ajouter une deuxième description
    const addDescBtn = await modal.findElement(By.css('.btn-accent'));
    await addDescBtn.click();

    // Attendre l'apparition de la nouvelle description
    const deuxiemeDesc = await driver.wait(
      until.elementLocated(By.css('.description-card:nth-child(2)')),
      3000
    );
    
    // Remplir la deuxième description
    const dateInput2 = await deuxiemeDesc.findElement(By.css('input[type="date"]'));
    await dateInput2.sendKeys('2024-01-16');
    
    const heureDebut2 = await deuxiemeDesc.findElement(By.css('input[type="time"]:first-child'));
    await heureDebut2.sendKeys('10:00');
    const heureFin2 = await deuxiemeDesc.findElement(By.css('input[type="time"]:last-child'));
    await heureFin2.sendKeys('12:00');
    
    const textArea2 = await deuxiemeDesc.findElement(By.css('textarea'));
    await textArea2.sendKeys('TP pratique');

    // 7. Supprimer la deuxième description
    const deleteBtn = await deuxiemeDesc.findElement(By.css('.remove-btn'));
    await deleteBtn.click();

    // 8. Soumettre le formulaire
    const submitBtn = await modal.findElement(By.css('.btn-primary'));
    await submitBtn.click();

    // 9. Vérifier la fermeture du modal
    await driver.wait(until.stalenessOf(modal), 5000);
    console.log('Modal fermé avec succès');

    // 10. Vérifier l'ajout réussi (exemple avec un toast)
    const toastSuccess = await driver.wait(
      until.elementLocated(By.css('.toast-success')),
      5000
    );
    const message = await toastSuccess.getText();
    assert.strictEqual(message, 'Créneau(s) ajouté(s) avec succès');

  } catch (error) {
    console.error('Erreur lors du test :', error);
    throw error;
  } finally {
    if (driver) await driver.quit();
  }
})();