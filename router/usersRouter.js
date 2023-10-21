import { Router } from 'express';
import { success, error } from '../functions/functions.js';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import Users from '../schemas/usersSchema.js';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

const usersRouter = Router();

usersRouter
    // READ ALL
    .get('/users', async (req, res) => {
        try {
            const users = await Users.find();
            res.status(200).json(success(users));
            console.log(users);
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get('/users/:id', async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);
            if (!user) {
                throw new Error('Utilisateur inexistant.');
            }

            res.status(200).json(success(user));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // SIGNUP
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

            const output = await vine.validate({
                schema,
                data,
            });

            if (output) {
                const user = await Users.findOne({ pseudo });

                bcrypt.compare(
                    password,
                    user.password,
                    function (err, result) {
                        if (result) {
                            res.status(200).json(success(result));
                        }
                        err && console.log(err);
                    }
                );
            }
        } catch (err) {
            console.log(err);
        }
    })

    // UPDATE ONE
    .put('/users/:id', async (req, res) => {
        try {
            const { pseudo, password } = req.body;
            const newUpdatedUser = {
                pseudo,
                password,
            };
            const userPseudoExist = await Users.findOne({ pseudo });

            // Vérifie si le pseudo de l'utilisateur est déjà utilisé
            if (
                userPseudoExist &&
                userPseudoExist._id != req.params.id
            ) {
                throw new Error('Pseudo déjà utilisé');
            }

            // Insère les nouvelles valeurs
            const userUpdated = await Users.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: newUpdatedUser,
                }
            );

            if (!userUpdated) {
                throw new Error(
                    "L'utilisateur avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(newUpdatedUser));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // DELETE ONE
    .delete('/users/:id', async (req, res) => {
        try {
            const userDeleted = await Users.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            if (userDeleted === 0) {
                throw new Error('Utilisateur introuvable.');
            }

            res.status(200).json(success('Utilisateur supprimé.'));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

export { usersRouter };
