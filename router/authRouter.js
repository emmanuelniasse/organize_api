import vine, { SimpleMessagesProvider } from "@vinejs/vine";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { success } from "../functions/functions.js";
import Users from "../schemas/usersSchema.js";

const authRouter = Router();

const messages = {
    string: "Le {{ field }} doit être une chaîne de caractères",
    minLength: "Le {{ field }} doit contenir {{ min }} caractères au minimum",
    maxLength: "Le {{ field }} doit contenir {{ max }} caractères au maximum",
};

vine.messagesProvider = new SimpleMessagesProvider(messages);

authRouter // SIGNUP
    .post("/signup", async (req, res) => {
        try {
            const { pseudo, password } = req.body;
            const saltRounds = 10;

            const schema = vine.object({
                pseudo: vine.string().minLength(4).maxLength(20),
                password: vine.string().minLength(8).maxLength(32),
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
                const userExist = await Users.findOne({ pseudo });
                if (userExist) {
                    return res
                        .status(400)
                        .json({ message: "Utilisateur déjà créé" });
                }

                bcrypt.hash(
                    password,
                    saltRounds,
                    async function (err, password) {
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
            console.log(err);
            let errorMsg = "Erreur lors de l'inscription";
            let fieldMessages = err.messages;

            fieldMessages &&
                fieldMessages.forEach((msg) => {
                    // TODO : refacto
                    msg.message = !"" && (errorMsg = msg.message);
                });
            console.log(errorMsg);
            res.status(500).json(errorMsg);
        }
    })

    // LOGIN
    .post("/login", async (req, res) => {
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
                if (!user) {
                    throw new Error("Utilisateur inconnu");
                }
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    throw new Error("Mot de passe incorrect");
                }

                const token = jwt.sign(
                    { userId: user._id, pseudo: user.pseudo },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: "1d", // Durée de validité du token
                    }
                );

                res.cookie("token", token, {
                    maxAge: 3600000,
                    httpOnly: false, // Rend le token accessible au front
                    // credentials: true,
                })
                    .status(200)
                    .json(success({ token }));
            } else {
                throw new Error("Informations invalides");
            }
        } catch (err) {
            res.status(500).json(err.message);
        }
    });

export { authRouter };
