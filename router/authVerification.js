import Users from '../schemas/usersSchema.js';
import jwt from 'jsonwebtoken';

async function authVerification(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token non trouvé' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(data.userId);
        if (!user) {
            throw { name: 'UserNotFound' };
        }
        req.user = {
            status: true,
            id: user._id,
            pseudo: user.pseudo,
        };

        // Ajouter l'en-tête Access-Control-Allow-Origin
        res.header('Access-Control-Allow-Origin', '*');
        // Autres en-têtes CORS si nécessaire
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        );
        // res.header('Access-Control-Allow-Credentials', 'true');

        next(); // Accède aux router privé
    } catch (err) {
        // console.log(JSON.stringify(err));
        switch (err.name) {
            case 'UserNotFound':
                return res.status(401).send('Utilisateur non trouvé');
            case 'TokenExpiredError':
                return res.status(401).send('Token expiré');
            default:
                return res
                    .status(401)
                    .send('Authentification invalide');
        }
    }
}

export { authVerification };
