import { Router } from 'express';
import bcrypt from 'bcrypt';
import vine from '@vinejs/vine';
import jwt from 'jsonwebtoken';

import { success, error } from '../functions/functions.js';
import Users from '../schemas/usersSchema.js';

const authRouter = Router();

authRouter // SIGNUP
    .post('/signup', async (req, res) => {
        try {
            const { pseudo, password } = req.body;
            const saltRounds = 10;

            const schema = vine.object({
                pseudo: vine.string(),
                password: vine.string().minLength(2).maxLength(32),
            });

            const data = {
                pseudo,
                password,
            };

            const output = await vine.validate({
                schema,
                data,
            });

            if (output) {
                // Vérifie si l'utilisateur est déjà créé
                const userExist = await Users.findOne({ pseudo });
                if (userExist) {
                    throw new Error('Utilisateur déjà créé');
                }

                // Crée l'utilisateur
                bcrypt.hash(
                    password,
                    saltRounds,
                    async function (err, password) {
                        if (err) {
                            res.status(400).json({
                                message: 'Utilisateur déjà créé',
                            });
                        }
                        const newUser = new Users({
                            pseudo,
                            password,
                        });
                        const userCreated = await newUser.save();
                        res.status(200).json(success(userCreated));
                    }
                );
            }
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // LOGIN
    .post('/login', async (req, res) => {
        try {
            const { pseudo, password } = req.body;

            const schema = vine.object({
                pseudo: vine.string(),
                password: vine.string().minLength(2).maxLength(32),
            });

            const data = {
                pseudo,
                password,
            };

            const userPayloadValid = await vine.validate({
                schema,
                data,
            });

            if (userPayloadValid) {
                const user = await Users.findOne({ pseudo });

                bcrypt.compare(
                    password,
                    user.password,
                    function (err, result) {
                        if (err || !result) {
                            return res
                                .status(401)
                                .json(error(result));
                        }
                        const token = jwt.sign(
                            { userId: user._id, pseudo: user.pseudo },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: '1h', // Durée de validité du token
                            }
                        );

                        res.cookie('token', token, {
                            maxAge: 900000,
                            httpOnly: false,
                        });

                        res.send({
                            success: true,
                            message: 'Cookies sent',
                            token: token,
                        });
                    }
                );
            }
        } catch (err) {
            console.log(err);
        }
    })

    // LOGOUT
    .post('/logout', (req, res) => {
        res.clearCookie('token');
        res.send({
            success: true,
            message: 'Déconnexion réussie',
        });
    });

export { authRouter };
