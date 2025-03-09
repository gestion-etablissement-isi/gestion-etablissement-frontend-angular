const glob = require('glob');
const path = require('path');

// Recherche récursive de tous les fichiers de test
glob.sync('projects/groupeisi/selenium-tests/**/*.test.js').forEach(file => {
  require(path.resolve(file));
});