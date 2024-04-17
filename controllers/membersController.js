const memberModel = require('../model/memberModel')
const EmptyException = require('../error/EmptyException');

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


// member/group/{id}
const listAllMembers = async function (req, res){
  const { id } = req.params;

  try {

    let members = await memberModel.listAllMembers(id);
    return res.status(200).send(members);

  } catch (error) {

    if (error instanceof EmptyException) {
      return res.status(204).send(error.message);
    }
    return res.status(500).send(error.message);
  }
} 

module.exports = {
    addGroupMember,
    listAllMembers
}

