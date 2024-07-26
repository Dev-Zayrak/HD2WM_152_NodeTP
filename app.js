const express = require('express');




//importer uuid -- le v4 permet d'extraire une fonction d'une libraire qui s'appelle v4


const app = express();

// Middleware pour parser le corps des requêtes JSON
// autorisé express à recevoir des données envoyer en JSON dans le body (le fameux payload)
app.use(express.json());





// init la connexion
const initMongoConnection = require('./mongoose/mongoose-config')

initMongoConnection();



// Routes
const articleRouter = require('./routes/article-routes')
app.use(articleRouter)

const authRouter = require('./routes/auth-routes')
app.use(authRouter)


app.listen(3000, () => {
    console.log("le serveur à démarré")
})













