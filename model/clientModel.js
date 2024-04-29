const groupModel = require('../model/groupsModel')

async function getClientGroups (id) {
  return groupModel.getAllGroupsFromClient(id)
}

module.exports = {
  getClientById,
  search,
  getClientGroups,
}

