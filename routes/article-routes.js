const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const Article = require('../mongoose/models/mongoose-article')
const helpers = require('../shared/helper')
const middlewares = require('../shared/middleware')

router.get('/articles', async (request, response) => {
    const articles = await Article.find()
    return helpers.responseService(response, '200', 'La liste des articles a été récupérés avec succès', articles)
})


router.get('/article/:id', middlewares.authMiddleware, async (request, response) => {
    // récupérer l'ID
    const articleId = request.params.id;

    //select un article
    const articleTrouver = await Article.findOne({ uid: articleId })

    if (articleTrouver) return helpers.responseService(response, '200', `L'article a été récupéré avec succès`, articleTrouver)
    else return helpers.responseService(response, '702', `Impossible de récupérer un article avec l'UID ${articleId}`, articleTrouver)
})



router.post('/save-article', middlewares.authMiddleware, async (request, response) => {
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
            return helpers.responseService(response, '404', `article non présent en BDD id : ${id}`, null)
        }
        if (titreDejaPresentupdate) {
            return helpers.responseService(response, '701', `Impossible de modifier un article si un autre article possède un titre similaire`, null)
        }
        await Article.updateOne({ uid: id }, { $set: request.body })
        articleApresModif = await Article.findOne({ uid: id })
        return helpers.responseService(response, '200', `Article modifié avec succès`, articleApresModif)
    }

    //controler si le titre existe déjà
    let titreDejaPresent = await Article.findOne({ title: nouvelleArticle.title })
    if (titreDejaPresent) {
        return helpers.responseService(response, '701', `Impossible d'ajouter un article avec un titre déjà existant`, null)
    }
    //sinon on créer l'article
    // généré uid
    nouvelleArticle.uid = uuidv4()
    const creationArticle = await Article.create(nouvelleArticle)
    await creationArticle.save()
    return helpers.responseService(response, '200', `Article ajouté avec succès`, creationArticle)
})


router.delete('/article/:id', middlewares.authMiddleware, async (request, response) => {

    let articleId = request.params.id

    const articleTrouver = await Article.findOne({ uid: articleId })

    if (!articleTrouver) {
        return helpers.responseService(response, '702', `Impossible de supprimer un article dont l'UID n'existe pas`, null)
    }
    await articleTrouver.deleteOne()
    return helpers.responseService(response, '200', `L'article ${articleId} a été supprimé avec succès`, articleTrouver)
})






//exporter le router
module.exports = router