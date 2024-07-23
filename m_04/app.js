const express = require('express');

// Instancier l'application serveur
const app = express();

// Mock list viennoiseries
let BDD_VIENNOISERIES = [
    'chocolatines',
    'Beurre Doux',
    'Pain au chocolat',
    'Croissant au chocolat',
    'Nantes c la Bretagne',
    'Pizza Ananas',
    'Crevette Nutella'
]


// Déclarer des routes -- similaire a un @getmapping en spring boot java
app.get('/viennoiseries', (request, response) => {
    // retourner la réponse JSON
    return response.json({viennoiseries : BDD_VIENNOISERIES});
});

// Démarrer
// param 1 = le port ou on lance le serveur
// param 2 = que faire quand le serveur à démarrer (afficher un log)
app.listen(3000, ()=> {
    console.log("le serveur à démarré")
})