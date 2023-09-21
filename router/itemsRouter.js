const express = require('express');
const itemsRouter = express.Router();
const { ObjectId } = require('mongodb');
const ItemsList = require('../schemas/itemsSchema');
const { success, error } = require('../functions/functions');

itemsRouter
    .get('/:category/:subcategory/itemslist', async (req, res) => {
        try {
            console.log(req.params.category);
            console.log(req.params.subcategory);
            const itemsList = await ItemsList.find({
                category: req.params.category,
                subcategory: req.params.subcategory,
            });
            res.status(200).json(success(itemsList));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get('/itemslist/:id', async (req, res) => {
        try {
            const singleCategory = await ItemsList.findById(
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
    .post('/itemslist', async (req, res) => {
        try {
            const { name, slug, category, subcategory } = req.body;

            // // Vérifie si la categorie est déjà crée
            // const thisItem = await ItemsList.findOne({
            //     name,
            // });

            // if (thisItem && thisItem._id != req.params.id) {
            //     throw new Error('Sous-catégorie déjà créée');
            // }

            // Créer une nouvelle sous-catégorie
            const itemToAdd = new ItemsList({
                name,
                slug,
                category,
                subcategory,
            });

            const savedItem = await itemToAdd.save();
            res.status(200).json(success(savedItem));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/itemslist/:id', async (req, res) => {
        try {
            const { name, slug, category, subcategory } = req.body;

            let itemToUpdate = {
                name,
                slug,
                category,
                subcategory,
            };

            // Vérifie si la categorie est déjà insérée
            const itemNameExist = await ItemsList.findOne({
                name,
            });
            if (itemNameExist && itemNameExist._id != req.params.id) {
                throw new Error('Sous-catégorie déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedItem = await ItemsList.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: itemToUpdate,
                }
            );

            if (!updatedItem) {
                throw new Error(
                    "La sous-catégorie avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(itemToUpdate));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // DELETE ONE
    .delete('/itemslist/:id', async (req, res) => {
        try {
            const deletedCount = await ItemsList.deleteOne({
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

module.exports = itemsRouter;
