import jwt from "jsonwebtoken";
import Users from "../schemas/usersSchema.js";

async function authVerification(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token non trouvé");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(data.userId);

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        req.user = {
            status: true,
            id: user._id,
            pseudo: user.pseudo,
        };

        next();
    } catch (err) {
        res.status(500).json(err.message);
    }
}

export { authVerification };
