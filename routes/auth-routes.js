const express = require('express')
const router = express.Router();
const User = require('../mongoose/models/mongoose-users')
const helpers = require('../shared/helper')

// Clé secrete
const JWT_SECRET = "croissant"


const jwt = require('jsonwebtoken')



// route pour se connecter
router.post('/auth', async (request, response) => {

    // récupérer l'utilisateur envoyé en JSON
    //let user = request.body
    let userMail = request.body.mail
    let userPwd = request.body.pwd

    //controler si l'ID et le mdp corresponds à la BDD
    let userTrouver = await User.findOne({ mail: userMail, pwd: userPwd })
    if (!userTrouver) {
        return helpers.responseService(response, '701', 'Couple email et mot de passe incorrect', null)
    }

    // se connecter (générer un token)
    const token = jwt.sign({ mail: userTrouver.mail }, JWT_SECRET, { expiresIn: '3 hours' })

    // Retourner la réponse json
    return helpers.responseService(response, '202', 'Authentifié(e) avec succès', token)
});



//exporter le router
module.exports = router