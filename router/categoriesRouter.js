const express = require('express');
const categoriesRouter = express.Router();
const { ObjectId } = require('mongodb');
const Categories = require('../schemas/categoriesSchema');
const { success, error } = require('../functions/functions');

categoriesRouter
    // READ ALL
    .get('/categories', async (req, res) => {
        try {
            const categories = await Categories.find();
            res.status(200).json(success(categories));
            console.log(categories);
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get('/categories/:id', async (req, res) => {
        try {
            const singleClass = await Categories.findById(
                req.params.id
            );
            if (!singleClass) {
                throw new Error('Catégorie inconnue');
            }

            res.status(200).json(success(singleClass));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // INSERT ONE
    .post('/categories', async (req, res) => {
        try {
            const { name, slug } = req.body;
            // Vérifie si la categorie est déjà crée
            const thisClass = await Categories.findOne({ name });

            if (thisClass && thisClass._id != req.params.id) {
                throw new Error('Categorie déjà crée');
            }

            // Créer un nouvel étudiant
            const classToAdd = new Categories({
                name,
                slug,
            });

            const savedClass = await classToAdd.save();
            res.status(200).json(success(savedClass));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/categories/:id', async (req, res) => {
        try {
            const { name, slug } = req.body;

            let classToUpdate = {
                name,
                slug,
            };

            // Vérifie si la categorie est déjà insérée
            const classNameExist = await Categories.findOne({ name });
            if (
                classNameExist &&
                classNameExist._id != req.params.id
            ) {
                throw new Error('Categorie déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedClass = await Categories.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: classToUpdate,
                }
            );

            if (!updatedClass) {
                throw new Error(
                    "La categorie avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(classToUpdate));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // DELETE ONE
    .delete('/categories/:id', async (req, res) => {
        try {
            const deletedCount = await Categories.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            if (deletedCount === 0) {
                throw new Error('Categorie introuvable');
            }

            res.status(200).json(success('Catégorie supprimé'));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

module.exports = categoriesRouter;
