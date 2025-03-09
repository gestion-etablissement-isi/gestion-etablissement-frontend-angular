const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testAccueilClasses() {
  // Configurer Selenium pour utiliser Chrome
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // Ouvrir la page d'accueil des classes
    await driver.get('http://localhost:4200/main/classes'); // Remplace par l'URL de ton app

    // Attendre que le tableau des classes soit chargé
    await driver.wait(until.elementLocated(By.css('table')), 10000); // Attend jusqu'à 10 secondes

    // Test 1 : Vérifier que la liste des classes est affichée
    const classesTable = await driver.findElement(By.css('table'));
    const classesRows = await classesTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de classes affichées : ${classesRows.length}`);

    // Test 2 : Rechercher une classe
    const searchInput = await driver.findElement(By.css('input[placeholder="Rechercher une classe..."]'));
    await searchInput.sendKeys('Classe de Test');
    await driver.sleep(1000); // Attendre que la recherche soit appliquée

    const filteredRows = await classesTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de classes après recherche : ${filteredRows.length}`);

    // Test 3 : Filtrer par année scolaire
    const anneeScolaireSelect = await driver.findElement(By.css('select[name="anneeScolaire"]'));
    await anneeScolaireSelect.sendKeys('2023-2024');
    await driver.sleep(1000); // Attendre que le filtre soit appliqué

    const filteredByYearRows = await classesTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de classes après filtrage par année : ${filteredByYearRows.length}`);

    // Test 4 : Ajouter une nouvelle classe
    const addButton = await driver.findElement(By.css('button.btn-primary'));
    await addButton.click();

    await driver.wait(until.elementLocated(By.css('.modal')), 5000);

    await driver.findElement(By.css('input[name="nom"]')).sendKeys('Nouvelle Classe');
    await driver.findElement(By.css('select[name="anneeScolaire"]')).sendKeys('2023-2024');
    await driver.findElement(By.css('input[name="capacite"]')).sendKeys('30');
    await driver.findElement(By.css('input[name="effectif"]')).sendKeys('25');

    await driver.findElement(By.css('.btn-primary')).click();

    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);

    const updatedClassesRows = await classesTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de classes après ajout : ${updatedClassesRows.length}`);

    // Test 5 : Modifier une classe existante
    const editButton = await driver.findElement(By.css('button[title="Modifier"]'));
    await editButton.click();

    await driver.wait(until.elementLocated(By.css('.modal')), 5000);

    await driver.findElement(By.css('input[name="nom"]')).clear();
    await driver.findElement(By.css('input[name="nom"]')).sendKeys('Classe Modifiée');

    await driver.findElement(By.css('.btn-primary')).click();

    await driver.wait(until.stalenessOf(driver.findElement(By.css('.modal'))), 5000);

    const modifiedClass = await driver.findElement(By.css('tbody tr:first-child td:first-child')).getText();
    console.log(`Nom de la classe modifiée : ${modifiedClass}`);

    // Test 6 : Supprimer une classe
    const deleteButton = await driver.findElement(By.css('button[title="Supprimer"]'));
    await deleteButton.click();

    await driver.sleep(1000); // Attendre la confirmation de suppression

    const finalClassesRows = await classesTable.findElements(By.css('tbody tr'));
    console.log(`Nombre de classes après suppression : ${finalClassesRows.length}`);

  } catch (error) {
    console.error('Test échoué :', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();