import Users from '../schemas/usersSchema.js';
import jwt from 'jsonwebtoken';

function authVerification(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token non trouvé' });
    }

    const token = authHeader.replace('Bearer ', '');
    jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async (err, data) => {
            if (err) {
                res.status(401).json({
                    error: 'JWT Token verification failed',
                });
            } else {
                const user = await Users.findById(data.userId);
                if (user) {
                    req.user = {
                        status: true,
                        pseudo: user.pseudo,
                    };
                    next(); // Accède aux router privé
                } else {
                    res.json({
                        status: false,
                        message: 'User not found',
                    });
                }
            }
        }
    );
}

export { authVerification };
