const memberModel = require('../model/memberModel')

const addGroupMember = async function (req, res) {
    const {idClient, idGroup} = req.params;
    const {members_id} = req.body
    
    let errors = await memberModel.addGroupMember(idClient, idGroup, members_id)
    if (errors.length == 0) {
        return res.status(200).send("OK");
    }else {
        return res.status(404).send(errors);
    }
}

module.exports = {
    addGroupMember
}