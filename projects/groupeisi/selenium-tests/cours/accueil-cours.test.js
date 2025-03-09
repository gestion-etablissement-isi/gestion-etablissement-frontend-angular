const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testAccueilCours() {
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

    // Test 1 : Vérifier que la liste des cours est affichée
    const coursTable = await driver.findElement(By.css('table'));
    const coursRows = await coursTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de cours affichés : ${coursRows.length}`);

    // Test 2 : Rechercher un cours
    const searchInput = await driver.findElement(By.css('input[placeholder="Rechercher un cours..."]'));
    await searchInput.sendKeys('Mathématiques');
    await driver.sleep(1000); // Attendre que la recherche soit appliquée

    const filteredRows = await coursTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de cours après recherche : ${filteredRows.length}`);

    // Test 3 : Filtrer par matière
    const matiereSelect = await driver.findElement(By.css('select[name="matiere"]'));
    await matiereSelect.sendKeys('Mathématiques');
    await driver.sleep(1000); // Attendre que le filtre soit appliqué

    const filteredByMatiereRows = await coursTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de cours après filtrage par matière : ${filteredByMatiereRows.length}`);

    // Test 4 : Ajouter un nouveau cours
    const addButton = await driver.findElement(By.css('button.btn-primary'));
    await addButton.click();

    await driver.wait(until.elementLocated(By.css('.modal')), 5000);

    await driver.findElement(By.css('input[name="titre"]')).sendKeys('Nouveau Cours');
    await driver.findElement(By.css('input[name="volumeHoraire"]')).sendKeys('30');
    await driver.findElement(By.css('input[name="coefficient"]')).sendKeys('2');
    await driver.findElement(By.css('select[name="matiere"]')).sendKeys('Mathématiques');
    await driver.findElement(By.css('select[name="professeur"]')).sendKeys('Jean Dupont');
    await driver.findElement(By.css('select[name="classe"]')).sendKeys('Classe A');
    await driver.findElement(By.css('select[name="anneeAcademique"]')).sendKeys('2024-2025');

    await driver.findElement(By.css('.btn-primary')).click();

    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);

    const updatedCoursRows = await coursTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de cours après ajout : ${updatedCoursRows.length}`);

    // Test 5 : Modifier un cours existant
    const editButton = await driver.findElement(By.css('button[title="Modifier"]'));
    await editButton.click();

    await driver.wait(until.elementLocated(By.css('.modal')), 5000);

    await driver.findElement(By.css('input[name="titre"]')).clear();
    await driver.findElement(By.css('input[name="titre"]')).sendKeys('Cours Modifié');

    await driver.findElement(By.css('.btn-primary')).click();

    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);

    const modifiedCours = await driver.findElement(By.css('tbody tr:first-child td:first-child')).getText();
    console.log(`Titre du cours modifié : ${modifiedCours}`);

    // Test 6 : Supprimer un cours
    const deleteButton = await driver.findElement(By.css('button[title="Supprimer"]'));
    await deleteButton.click();

    await driver.sleep(1000); // Attendre la confirmation de suppression

    const finalCoursRows = await coursTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de cours après suppression : ${finalCoursRows.length}`);

  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();