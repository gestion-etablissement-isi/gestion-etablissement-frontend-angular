export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8180', // Utiliser le nom du service Docker
    realm: 'master',
    clientId: 'groupeisi'
  }
};