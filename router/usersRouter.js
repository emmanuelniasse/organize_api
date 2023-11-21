import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { success, error } from '../functions/functions.js';
import Users from '../schemas/usersSchema.js';

import cors from 'cors';

const usersRouter = Router(
    cors({
        allowOrigin: 'https://organize-kappa.vercel.app',
        methods: 'GET,POST,PUT,DELETE,OPTIONS',
        allowedHeaders:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, ngrok-skip-browser-warning, Authorization',
    })
);

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
