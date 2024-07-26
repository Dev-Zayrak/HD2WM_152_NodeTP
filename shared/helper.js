module.exports = {

    //quand on exporte une fonction qui était écrite :
    // function maFunction(){}
    //ca devient
    //maFunction : () => {}



    //Fonction utilitaire pour retourner une structure de réponse métier
    responseService : (response, code, message, data) => {
        //Message d'erreur générique
        return response.json({ code: code, message: message, data: data });
    }
}