import { Router } from "express";
import { ObjectId } from "mongodb";
import { error, success } from "../functions/functions.js";
import Expenses from "../schemas/expensesSchema.js";

const expensesRouter = Router();

expensesRouter
    // READ ALL
    .get("/expenses", async (req, res) => {
        try {
            const userId = req.user.id;
            const expenses = await Expenses.find({
                user: userId,
            }).sort({ _id: -1 });
            // .populate({
            //     // path: 'category',
            //     select: 'name slug',
            // });
            res.status(200).json(success(expenses));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // READ ONE
    .get("/expenses/:id", async (req, res) => {
        try {
            const singleClass = await Expenses.findById(req.params.id);
            if (!singleClass) {
                throw new Error("Dépense inconnue");
            }

            res.status(200).json(success(singleClass));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // INSERT ONE
    .post("/expenses", async (req, res) => {
        try {
            const userId = req.user.id;
            const did = false;
            const { name, sum, description, slug } = req.body;

            const expenseName = await Expenses.findOne({ name });
            if (expenseName && expenseName._id != req.params.id) {
                throw new Error("Dépense déjà ajoutée");
            }

            const expenseToAdd = new Expenses({
                user: userId,
                name,
                sum,
                description,
                did,
                slug,
            });

            const savedExpense = await expenseToAdd.save();
            res.status(200).json(success(savedExpense));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // UPDATE ONE
    .put("/expenses/:id", async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, sum, description, slug } = req.body;

            let expenseToUpdate = {
                user: userId,
                name,
                sum,
                description,
                slug,
            };

            const updatedExpense = await Expenses.findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: expenseToUpdate,
                }
            );

            if (!updatedExpense) {
                throw new Error(
                    "La dépense " + req.params.id + " est introuvable."
                );
            }

            res.status(200).json(success(expenseToUpdate));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    })

    // DELETE ONE
    .delete("/expenses/:id", async (req, res) => {
        try {
            const deletedCount = await Expenses.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            if (deletedCount === 0) {
                throw new Error("Dépense introuvable");
            }

            res.status(200).json(success("Dépense supprimée"));
        } catch (err) {
            res.status(500).json(error(err.message));
        }
    });

export { expensesRouter };
