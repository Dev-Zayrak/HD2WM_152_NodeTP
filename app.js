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

//Création d'une fonction qui permet faire le message d'erreur
function responseService(response, code, message, data){
    //Message d'erreur générique
    return response.json({ code: code, message : message, data : data});
}


app.get('/articles', async (request, response) =>{
    const articles = await Article.find()
    return responseService(response, '200', 'La liste des articles a été récupérés avec succès', articles)   
})


app.get('/article/:id', async (request, response)=> {
    // récupérer l'ID
    const articleId = request.params.id;

    //select un article
    const articleTrouver = await Article.findOne({uid : articleId})

    if(articleTrouver) return responseService(response, '200', `L'article a été récupéré avec succès`, articleTrouver) 
        else return responseService(response, '702', `Impossible de récupérer un article avec l'UID ${articleId} | Null`, articleTrouver)
})



app.post('/save-article', async (request, response)=>{
    // récupérer l'article envoyé en JSON
    let nouvelleArticle = request.body
    let articleTrouver = null
    const id = request.body.id

    //controler si le titre existe déjà
    let titreDejaPresent = await Article.findOne({title : nouvelleArticle.title})




    //controler si l'article possède un ID et du coup on modifie
    if(nouvelleArticle.id != undefined || nouvelleArticle.id){
        // controler si l'article est present en BDD
        articleTrouver = await Article.findOne({uid : id})
        if(!articleTrouver){
            return response.json(`article non présent en BDD id : ${id}`)
        }
        if(titreDejaPresent){
            return responseService(response, '701', `Impossible de modifier un article si un autre article possède un titre similaire`, null)
        }
        await Article.updateOne({uid : id}, {$set: request.body})
        articleApresModif = await Article.findOne({uid : id})
        return responseService(response, '200', `Article modifié avec succès`, articleApresModif)
    }
 
    //controler si le titre existe déjà
    if(titreDejaPresent){
        return responseService(response, '701', `Impossible d'ajouter un article avec un titre déjà existant`, null)
    }
    //sinon on créer l'article
    // généré uid
    nouvelleArticle.uid = uuidv4()
    const creationArticle = await Article.create(nouvelleArticle)
    await creationArticle.save()
    return responseService(response, '200', `Article ajouté avec succès`, creationArticle)
})


app.delete('/article/:id', async (request, response)=> {

    let articleId = request.params.id
    
    const articleTrouver = await Article.findOne({uid : articleId})

    if(!articleTrouver){
        return responseService(response, '702', `Impossible de supprimer un article dont l'UID n'existe pas`, null)
    }
    await articleTrouver.deleteOne()
    return responseService(response, '200', `L'article ${articleId} a été supprimé avec succès`, articleTrouver)
  }) 


app.listen(3000, ()=> {
    console.log("le serveur à démarré")
})
