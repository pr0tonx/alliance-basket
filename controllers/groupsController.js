const { Group } = require('../models/Group');

const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const RequiredFieldLengthException = require('../error/InvalidFieldLengthException');

const membersController = require('./membersController');

const createGroup = async function (req, res) {
  const adminId = Number(req.params.idClient);
  const { invites, ...groupValues } = req.body;

  try {
    const group = await Group.create({ adminId, ...groupValues });
    req.body.idGroup = group.dataValues.id;

    if (req.body.invites.length > 0) {
      await membersController.addMember(req, res);
    }

    res.status(200).send({ group });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
    // TODO errors
  }
};

const getGroupById = async function (req, res) {
  const { id } = req.params;

  try {
    const group = await Group.findByPK(id);

    return res.status(200).send(group);
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err);
    }
    res.status(500).send(err); // TODO
  }
}

const getGroupsByClientId = async function (req, res) {
  const { idGroup } = req.params;

  try {
    // findAllGroupsByClientId
  } catch (err) {

  }
}

const updateGroup = async function (req, res) {
  try {

  } catch (err) {

  }
}

const deleteGroup = async function (req, res) { // só o admin do grupo
  try {

  } catch (err) {

  }
}

const leaveGroup = async function (req, res) {

}

/** System Admin functions only **/
const getAllGroups = async function (req, res) {
  try {

  } catch (err) {

  }
}

module.exports = {
  createGroup,
  getGroupById,
  getGroupsByClientId
};

// const db = require('../database/database');
//
// const createGroup = async function (req, res) {
//     try {
//         const {idClient} = req.params;
//         const {groupName, adminOnlyExpenses} = req.body;
//
//         if (!groupName) {
//             res.status(400).send({
//                 error: 'Bad Request',
//                 message: 'No empty field allowed.',
//                 code: 400
//             });
//             return;
//         }
//
//         await db.createGroup(groupName, idClient, adminOnlyExpenses);
//
//         res.status(200).send({});
//     } catch (err) {
//         res.status(500).send('Something went wrong');
//         throw err;
//     }
// }
//
// const getAllGroups = async function (req, res) {
//     try {
//         const groups = await db.getAllGroups();
//
//         res.status(200).send(groups);
//     } catch (err) {
//         res.status(500).send('Something went wrong');
//         throw err;
//     }
// }
//
// const editGroup = async function (req, res) {
//     try {
//         // TODO check if the user trying to edit the group is the group admin
//         // the option itself just only show to the admin, yet it's a good safety improvement
//
//         const {idGroup} = req.params;
//         const {groupName} = req.body;
//
//         await db.editGroup(idGroup, groupName);
//
//         res.status(200).send('Group edited successfully');
//     } catch (err) {
//         res.status(500).send('Something went wrong.');
//         throw err;
//     }
// }
//
// // const getGroupsByClient = async function (req, res) {
// //     try {
// //         const {idClient} = req.params;
// //
// //         const group = db.getGroupsByClient(idClient);
// //
// //         res.status(200).send(group);
// //     } catch (err) {
// //         res.status(500).send('Something went wrong.');
// //         throw err;
// //     }
// // }
//
// const deleteGroup = async function (req, res) {
//     try {
//
//         const {idGroup} = req.params;
//
//         await db.deleteGroup(idGroup);
//
//         res.status(200).send('Group deleted successfully.');
//     } catch (err) {
//         if (err.code === 'ER_ROW_IS_REFERENCED_2') {
//             // testar trigger depois => tentar excluir um grupo precisa também excluir os participantes dele do grupo na table members
//             res.status(501).send('NOT IMPLEMENTED YET'); // TODO
//         }
//         res.status(500).send('Something went wrong.');
//         throw err;
//     }
// }
//
//
// module.exports = {
//     createGroup,
//     getAllGroups,
//     editGroup,
//     deleteGroup
// }