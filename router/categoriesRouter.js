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
            const singleCategory = await Categories.findById(
                req.params.id
            );
            if (!singleCategory) {
                throw new Error('Catégorie inconnue');
            }

            res.status(200).json(success(singleCategory));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // INSERT ONE
    .post('/categories', async (req, res) => {
        try {
            const { name } = req.body;
            // Vérifie si la dépense est déjà créee
            const thisCategory = await Categories.findOne({ name });

            if (thisCategory && thisCategory._id != req.params.id) {
                throw new Error('Catégorie déjà existante');
            }

            // Créer une nouvelle catégorie
            const categoryToAdd = new Categories({
                name,
            });

            const savedCategory = await categoryToAdd.save();
            res.status(200).json(success(savedCategory));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/categories/:id', async (req, res) => {
        try {
            const { name } = req.body;

            let categoryToUpdate = {
                name,
            };

            // Vérifie si la catégorie existe
            const categoryNameExist = await Categories.findOne({
                name,
            });
            if (
                categoryNameExist &&
                categoryNameExist._id != req.params.id
            ) {
                throw new Error('Catégorie déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedCategory = await Categories.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: categoryToUpdate,
                }
            );

            if (!updatedCategory) {
                throw new Error(
                    "La catégorie avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(categoryToUpdate));
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
                throw new Error('Catégorie introuvable');
            }

            res.status(200).json(success('Catégorie supprimée'));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

module.exports = categoriesRouter;
