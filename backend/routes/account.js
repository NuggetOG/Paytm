const express = require('express');
const authenticateToken = require('../middleware');
const accountRouter = express.Router();
const { User, Accounts } = require('../db');
const { MongoClient } = require('mongodb');
require('dotenv').config();

accountRouter.get('/info', (req, res) => {
    res.send("User info");
});

accountRouter.get('/balance', authenticateToken, async (req, res) => {
    try {
        console.log(req.user);
        const account = await Accounts.findOne({userId : req.user.userId});
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }
        return res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching balance." });
    }
});

accountRouter.post('/transfer', authenticateToken, async (req, res) => {
    const { to, amount } = req.body;

    // Validate input
    if (!to || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid transfer details." });
    }

    try {
        const account = await Accounts.findOne({userId:req.user.userId});
        if (!account) {
            return res.status(404).json({ message: "Source account not found." });
        }

        // Check if source account has enough balance
        console.log(account.balance);
        if (account.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance." });
        }

        const accountId = account._id;

        let target = await User.findOne({_id : to});
        console.log(target._id);
        if (!target) {
            return res.status(404).json({ message: "Target user not found." });
        }

        target = await Accounts.findOne({userId : to});
        if (!target) {
            return res.status(404).json({ message: "Target account not found." });
        }
        const targetId = target._id;

        const client = new MongoClient(process.env.CONNECTION_STRING);
        await client.connect();

        try {
            const result = await transferMoney(client, accountId, targetId, amount);
            if (result) {
                return res.status(200).json({ message: "Transaction successful." });
            } else {
                return res.status(400).json({ message: "Transaction aborted." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error during transaction." });
        } finally {
            await client.close();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unexpected error occurred." });
    }

    async function transferMoney(client, account1, account2, amt) {
        const session = client.startSession();
    
        try {
            const transactionResults = await session.withTransaction(async () => {
                const db = client.db(); // Get the database from the MongoClient instance
    
                // Subtract money from the source account
                const subtractMoneyResults = await db.collection("accounts").updateOne(
                    { _id: account1 },
                    { $inc: { balance: amt * -1 } },
                    { session }
                );
                console.log(`${subtractMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account1}.`);
                console.log(`${subtractMoneyResults.modifiedCount} document(s) were updated to remove the money.`);
    
                // If no money was subtracted, abort the transaction
                if (subtractMoneyResults.modifiedCount !== 1) {
                    await session.abortTransaction();
                    return false;
                }
    
                // Add money to the target account
                const addMoneyResults = await db.collection("accounts").updateOne(
                    { _id: account2 },
                    { $inc: { balance: amt } },
                    { session }
                );
                console.log(`${addMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account2}.`);
                console.log(`${addMoneyResults.modifiedCount} document(s) were updated to add the money.`);
                
                // If no money was added, abort the transaction
                if (addMoneyResults.modifiedCount !== 1) {
                    await session.abortTransaction();
                    return false;
                }
                return true;
            });
    
            return transactionResults;
        } catch (e) {
            console.log("The money was not transferred. The transaction was aborted due to an unexpected error: " + e);
            return false;
        } finally {
            await session.endSession();
        }
    }
});

module.exports = accountRouter;
