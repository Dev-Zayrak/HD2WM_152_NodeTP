const express = require('express');


const app = express();

// Middleware pour parser le corps des requêtes JSON
// autorisé express à recevoir des données envoyer en JSON dans le body (le fameux payload)
app.use(express.json());


let articles = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];


app.get('/articles', (request, response) =>{
    return response.json({message : articles})

    // Réponse partie 1
        //return response.send('Retournera la liste des articles')  
})


app.get('/article/:id', function (request, response) {
    // conversion en int
    let articleId = parseInt(request.params.id);

    //
    let article = articles.find(a => a.id === articleId)

    if(article) response.json(article)
        else response.send(`l'article ayant l'ID : ${request.params.id} n'existe pas`)

    
    // Réponse partie 1
        //response.send(`retournera l article ayant l id : ${request.params.id}`)
})


app.post('/save-article', function (request, response){
    // récupérer l'article envoyé en JSON
    const nouvelleArticle = request.body

    let articleTrouve = null;
    // on regarde si on a un ID dans le JSON
    if(articleTrouve!= undefined || nouvelleArticle.id){
        // essayé de trouver un article existant
        articleTrouve = articles.find(a => a.id === nouvelleArticle.id)
    }
    

    if(!article){
        articles.push(nouvelleArticle)
        response.send(`l'article avec l'ID : ${nouvelleArticle.id} à été créé avec succès`)
    }else{
        let indexArticle = articles.findIndex(a => a.id === nouvelleArticle.id)
        articles.splice(indexArticle, 1, nouvelleArticle)
        response.send(`l'article avec l'ID : ${nouvelleArticle.id} à été mis à jour avec succès`)
    }

    // Réponse partie 1
        //response.send(`va créer / mettre à jour un article envoyé`)
})


app.delete('/article/:id', function (request, response) {

    let articleId = parseInt(request.params.id);
    let article = articles.find(a => a.id === articleId)

    if(article){
        let indexArticle = articles.findIndex(a => a.id === articleId)
        articles.splice(indexArticle, 1)
        response.send(`Article supprimé avec succès`)
    }else response.send(`Article non trouvé`)

    // Réponse partie 1
        //response.send(`supprimera l article ayant l id : ${request.params.id}`)
  }) 


app.listen(3000, ()=> {
    console.log("le serveur à démarré")
})