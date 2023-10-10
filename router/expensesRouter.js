const express = require('express');
const expensesRouter = express.Router();
const { ObjectId } = require('mongodb');
const Expenses = require('../schemas/expensesSchema');
const { success, error } = require('../functions/functions');

expensesRouter
    // READ ALL
    .get('/expenses', async (req, res) => {
        try {
            const expenses = await Expenses.find();
            res.status(200).json(success(expenses));
            console.log(expenses);
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get('/expenses/:id', async (req, res) => {
        try {
            const singleClass = await Expenses.findById(
                req.params.id
            );
            if (!singleClass) {
                throw new Error('Dépense inconnue');
            }

            res.status(200).json(success(singleClass));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // INSERT ONE
    .post('/expenses', async (req, res) => {
        try {
            const { name, sum, slug } = req.body;
            // Vérifie si la dépense est déjà crée
            const thisClass = await Expenses.findOne({ name });

            if (thisClass && thisClass._id != req.params.id) {
                throw new Error('dépense déjà crée');
            }

            // Créer un nouvel étudiant
            const classToAdd = new Expenses({
                name,
                sum,
                slug,
            });

            const savedClass = await classToAdd.save();
            res.status(200).json(success(savedClass));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/expenses/:id', async (req, res) => {
        try {
            const { name, sum, slug } = req.body;

            let classToUpdate = {
                name,
                sum,
                slug,
            };

            // Vérifie si la dépense est déjà insérée
            const classNameExist = await Expenses.findOne({ name });
            if (
                classNameExist &&
                classNameExist._id != req.params.id
            ) {
                throw new Error('dépense déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedClass = await Expenses.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: classToUpdate,
                }
            );

            if (!updatedClass) {
                throw new Error(
                    "La dépense avec l'id : '" +
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
    .delete('/expenses/:id', async (req, res) => {
        try {
            const deletedCount = await Expenses.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            if (deletedCount === 0) {
                throw new Error('Dépense introuvable');
            }

            res.status(200).json(success('Dépense supprimée'));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

module.exports = expensesRouter;
