// Clé secrete
const JWT_SECRET = "croissant"
const jwt = require('jsonwebtoken')

module.exports = {

    // Middleware
    authMiddleware: async (request, response, next) => {
        // Si token null alors erreur
        if (request.headers.authorization == undefined || !request.headers.authorization) {
            return response.json({ message: "Token null" });
        }

        // Extraire le token (qui est bearer)
        const token = request.headers.authorization.substring(7);

        // par defaut le result est null
        let result = null;
        console.log(token)

        // Si reussi à générer le token sans crash
        try {
            result = await jwt.verify(token, JWT_SECRET);
        } catch {
        }

        // Si result null donc token incorrect
        if (!result) {
            return response.json({ message: "token pas bon" });
        }

        // On passe le middleware
        return next();

    }


}