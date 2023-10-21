import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { success, error } from '../functions/functions.js';
import Expenses from '../schemas/expensesSchema.js';

const expensesRouter = Router();

expensesRouter
    // READ ALL
    .get('/expenses', async (req, res) => {
        try {
            const expenses = await Expenses.find().populate({
                path: 'category',
                select: 'name slug',
            });
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
            const { name, sum, description, category, slug } =
                req.body;
            // Vérifie si la dépense est déjà créée
            const thisExpense = await Expenses.findOne({ name });

            if (thisExpense && thisExpense._id != req.params.id) {
                throw new Error('Dépense déjà créée');
            }

            // Créer un nouvel étudiant
            const expenseToAdd = new Expenses({
                name,
                sum,
                description,
                category,
                slug,
            });

            const savedExpense = await expenseToAdd.save();
            res.status(200).json(success(savedExpense));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put('/expenses/:id', async (req, res) => {
        try {
            const { name, sum, description, category, slug } =
                req.body;

            let expenseToUpdate = {
                name,
                sum,
                description,
                category,
                slug,
            };

            // Vérifie si la dépense est déjà insérée
            const expenseNameExist = await Expenses.findOne({ name });
            if (
                expenseNameExist &&
                expenseNameExist._id != req.params.id
            ) {
                throw new Error('dépense déjà insérée');
            }

            // Insère les nouvelles valeurs
            const updatedExpense = await Expenses.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: expenseToUpdate,
                }
            );

            if (!updatedExpense) {
                throw new Error(
                    "La dépense avec l'id : '" +
                        req.params.id +
                        "' est introuvable."
                );
            }

            res.status(200).json(success(expenseToUpdate));
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

export { expensesRouter };
