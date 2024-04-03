const db = require('../database/database');

const addGroupMember = async function (req, res) {
    const {idClient, idGroup} = req.params;
    const {members} = req.body;

    // TODO again, opção só deve aparecer para o admin, entretanto, checar se não for o caso

    console.log(members);
    // const addedMembers = members.map(async member => {
    //    await db.addMemberToGroup(idGroup, member);
    // });

    // res.status(200).send(addedMembers);
}

module.exports = {
    addGroupMember
}