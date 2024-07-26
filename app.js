const express = require('express');
const jwt = require('jsonwebtoken')

// Clé secrete
const JWT_SECRET = "croissant"

//importer uuid -- le v4 permet d'extraire une fonction d'une libraire qui s'appelle v4
const { v4: uuidv4 } = require('uuid')

const app = express();

// Middleware pour parser le corps des requêtes JSON
// autorisé express à recevoir des données envoyer en JSON dans le body (le fameux payload)
app.use(express.json());

//==============BDD==============//
// importer mongoose
const mongoose = require('mongoose')

//Ecouter quand la connexion success
mongoose.connection.once('open', () => {
    console.log(`Connecté à la BDD`)
})

//Ecouter quand la connexion plante
mongoose.connection.on('error', (err) => {
    console.log(`Erreur de BDD : ${err}`)
})

//Se connecter à mongo db
mongoose.connect('mongodb://localhost:27017/db_article')



const Article = mongoose.model('Article', { uid: String, title: String, content: String, author: String }, 'articles')
const User = mongoose.model('User', { mail: String, pwd: String }, 'users')

//==============BDD==============//

//Fonction utilitaire pour retourner une structure de réponse métier
function responseService(response, code, message, data) {
    //Message d'erreur générique
    return response.json({ code: code, message: message, data: data });
}

// Middleware
function authMiddleware(request, response, next) {
    // Si token null alors erreur
    if (request.headers.authorization == undefined || !request.headers.authorization) {
        return response.json({ message: "Token null" });
    }

    // Extraire le token (qui est bearer)
    const token = request.headers.authorization.substring(7);

    // par defaut le result est null
    let result = null;

    // Si reussi à générer le token sans crash
    try {
        result = jwt.verify(token, JWT_SECRET);
    } catch {
    }

    // Si result null donc token incorrect
    if (!result) {
        return response.json({ message: "token pas bon" });
    }

    // On passe le middleware
    return next();

}


// route pour se connecter
app.post('/auth', async (request, response) => {

    // récupérer l'utilisateur envoyé en JSON
    //let user = request.body
    let userMail = request.body.mail
    let userPwd = request.body.pwd

    //controler si l'ID et le mdp corresponds à la BDD
    let userTrouver = await User.findOne({ mail: userMail, pwd: userPwd })
    if (!userTrouver) {
        return responseService(response, '701', 'Couple email et mot de passe incorrect', null)
    }

    // se connecter (générer un token)
    const token = jwt.sign({ mail: userTrouver.mail }, JWT_SECRET, { expiresIn: '3 hours' })

    // Retourner la réponse json
    return responseService(response, '202', 'Authentifié(e) avec succès', token)
});




app.get('/articles', async (request, response) => {
    const articles = await Article.find()
    return responseService(response, '200', 'La liste des articles a été récupérés avec succès', articles)
})


app.get('/article/:id', authMiddleware, async (request, response) => {
    // récupérer l'ID
    const articleId = request.params.id;

    //select un article
    const articleTrouver = await Article.findOne({ uid: articleId })

    if (articleTrouver) return responseService(response, '200', `L'article a été récupéré avec succès`, articleTrouver)
    else return responseService(response, '702', `Impossible de récupérer un article avec l'UID ${articleId}`, articleTrouver)
})



app.post('/save-article', authMiddleware, async (request, response) => {
    // récupérer l'article envoyé en JSON
    let nouvelleArticle = request.body
    let articleTrouver = null
    const id = request.body.id

    //controler si le titre existe déjà -- $ne = not equals
    let titreDejaPresentupdate = await Article.findOne({ title: nouvelleArticle.title, uid: { $ne: nouvelleArticle.id } })




    //controler si l'article possède un ID et du coup on modifie
    if (nouvelleArticle.id != undefined || nouvelleArticle.id) {
        // controler si l'article est present en BDD
        articleTrouver = await Article.findOne({ uid: id })
        if (!articleTrouver) {
            return response.json(`article non présent en BDD id : ${id}`)
        }
        if (titreDejaPresentupdate) {
            return responseService(response, '701', `Impossible de modifier un article si un autre article possède un titre similaire`, null)
        }
        await Article.updateOne({ uid: id }, { $set: request.body })
        articleApresModif = await Article.findOne({ uid: id })
        return responseService(response, '200', `Article modifié avec succès`, articleApresModif)
    }

    //controler si le titre existe déjà
    let titreDejaPresent = await Article.findOne({ title: nouvelleArticle.title })
    if (titreDejaPresent) {
        return responseService(response, '701', `Impossible d'ajouter un article avec un titre déjà existant`, null)
    }
    //sinon on créer l'article
    // généré uid
    nouvelleArticle.uid = uuidv4()
    const creationArticle = await Article.create(nouvelleArticle)
    await creationArticle.save()
    return responseService(response, '200', `Article ajouté avec succès`, creationArticle)
})


app.delete('/article/:id', async (request, response) => {

    let articleId = request.params.id

    const articleTrouver = await Article.findOne({ uid: articleId })

    if (!articleTrouver) {
        return responseService(response, '702', `Impossible de supprimer un article dont l'UID n'existe pas`, null)
    }
    await articleTrouver.deleteOne()
    return responseService(response, '200', `L'article ${articleId} a été supprimé avec succès`, articleTrouver)
})


app.listen(3000, () => {
    console.log("le serveur à démarré")
})
