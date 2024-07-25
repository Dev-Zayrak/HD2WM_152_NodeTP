const express = require('express');

//importer uuid -- le v4 permet d'extraire une fonction d'une libraire qui s'appelle v4
const { v4: uuidv4} = require('uuid')

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

const Article = mongoose.model('Article', {uid: String, title: String, content: String, author: String}, 'articles')
//==============BDD==============//




app.get('/articles', async (request, response) =>{
    const articles = await Article.find()
    return response.json(articles)     
})


app.get('/article/:id', async (request, response)=> {
    // récupérer l'ID
    const articleId = request.params.id;

    //select un article
    const articleTrouver = await Article.findOne({uid : articleId})

    if(articleTrouver) response.json(articleTrouver)
        else response.send(`l'article ayant l'ID : ${articleId} n'existe pas`)
})


app.post('/save-article', async (request, response)=>{
    // récupérer l'article envoyé en JSON
    let nouvelleArticle = request.body
    let articleTrouver = null
    const id = request.body.id


    //controler si l'article possède un ID et du coup on modifie
    if(nouvelleArticle.id != undefined || nouvelleArticle.id){
        // controler si l'article est present en BDD
        articleTrouver = await Article.findOne({uid : id})
        if(!articleTrouver){
            return response.json(`article non présent en BDD id : ${id}`)
        }
        await Article.updateOne({uid : id}, {$set: request.body})
        return response.json(`L'article id : ${articleTrouver.uid} à été mise à jour`)
    }
 
    //sinon on créer l'article
    // généré uid
    nouvelleArticle.uid = uuidv4()
    const creationArticle = await Article.create(nouvelleArticle)
    await creationArticle.save()
    return response.json(creationArticle)
})


app.delete('/article/:id', async (request, response)=> {

    let articleId = request.params.id
    
    const articleTrouver = await Article.findOne({uid : articleId})

    if(!articleTrouver){
    return response.json(`Article non trouvé`)
    }
    await articleTrouver.deleteOne()
    return response.json(`article avec l'ID ${articleId} est supprimé`)
  }) 


app.listen(3000, ()=> {
    console.log("le serveur à démarré")
})
