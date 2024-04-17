const db = require('../database/database');

const createGroup = async function (req, res) {
    try {
        const {idClient} = req.params;
        const {groupName, adminOnlyExpenses} = req.body;

        if (!groupName) {
            res.status(400).send({
                error: 'Bad Request',
                message: 'No empty field allowed.',
                code: 400
            });
            return;
        }

        await db.createGroup(groupName, idClient, adminOnlyExpenses);

        res.status(200).send({});
    } catch (err) {
        res.status(500).send('Something went wrong');
        throw err;
    }
}

const getAllGroups = async function (req, res) {
    try {
        const groups = await db.getAllGroups();

        res.status(200).send(groups);
    } catch (err) {
        res.status(500).send('Something went wrong');
        throw err;
    }
}

const editGroup = async function (req, res) {
    try {
        // TODO check if the user trying to edit the group is the group admin
        // the option itself just only show to the admin, yet it's a good safety improvement

        const {idGroup} = req.params;
        const {groupName} = req.body;

        await db.editGroup(idGroup, groupName);

        res.status(200).send('Group edited successfully');
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
    }
}

// const getGroupsByClient = async function (req, res) {
//     try {
//         const {idClient} = req.params;
//
//         const group = db.getGroupsByClient(idClient);
//
//         res.status(200).send(group);
//     } catch (err) {
//         res.status(500).send('Something went wrong.');
//         throw err;
//     }
// }

const deleteGroup = async function (req, res) {
    try {

        const {idGroup} = req.params;

        await db.deleteGroup(idGroup);

        res.status(200).send('Group deleted successfully.');
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            // testar trigger depois => tentar excluir um grupo precisa também excluir os participantes dele do grupo na table members
            res.status(501).send('NOT IMPLEMENTED YET'); // TODO
        }
        res.status(500).send('Something went wrong.');
        throw err;
    }
}


module.exports = {
    createGroup,
    getAllGroups,
    editGroup,
    deleteGroup
}