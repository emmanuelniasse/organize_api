const express = require('express');
const subcategoriesRouter = express.Router();
const { ObjectId } = require('mongodb');
const Subcategories = require('../schemas/subcategoriesSchema');
const { success, error } = require('../functions/functions');

subcategoriesRouter
    // READ ALL
    .get('/:category/subcategories/', async (req, res) => {
        try {
            console.log(req.params.category);
            const subcategories = await Subcategories.find({
                category: req.params.category,
            });
            res.status(200).json(success(subcategories));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get('/subcategories/:id', async (req, res) => {
        try {
            const singleCategory = await Subcategories.findById(
                req.params.id
            );
            if (!singleCategory) {
                throw new Error('Sous-catégorie inconnue');
            }

            res.status(200).json(success(singleCategory));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // INSERT ONE
    .post('/subcategories', async (req, res) => {
        try {
            const { name, slug, category } = req.body;
            // Vérifie si la categorie est déjà crée
            const thisSubcategory = await Subcategories.findOne({
                name,
            });

            if (
                thisSubcategory &&
                thisSubcategory._id != req.params.id
            ) {
                throw new Error('Sous-catégorie déjà créée');
            }

            // Créer une nouvelle sous-catégorie
            const subcategoryToAdd = new Subcategories({
                name,
                slug,
                category,
            });

            const savedSubcategory = await subcategoryToAdd.save();
            res.status(200).json(success(savedSubcategory));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/subcategories/:id', async (req, res) => {
        try {
            const { name, slug } = req.body;

            let subcategoryToUpdate = {
                name,
                slug,
            };

            // Vérifie si la categorie est déjà insérée
            const subcategoryNameExist = await Subcategories.findOne({
                name,
            });
            if (
                subcategoryNameExist &&
                subcategoryNameExist._id != req.params.id
            ) {
                throw new Error('Sous-catégorie déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedSubcategory =
                await Subcategories.findOneAndUpdate(
                    { _id: new ObjectId(req.params.id) },
                    {
                        $set: subcategoryToUpdate,
                    }
                );

            if (!updatedSubcategory) {
                throw new Error(
                    "La sous-catégorie avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(subcategoryToUpdate));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // DELETE ONE
    .delete('/subcategories/:id', async (req, res) => {
        try {
            const deletedCount = await Subcategories.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            if (deletedCount === 0) {
                throw new Error('Sous-catégorie introuvable');
            }

            res.status(200).json(success('Sous-catégorie supprimée'));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

module.exports = subcategoriesRouter;
