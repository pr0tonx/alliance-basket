const db = require('../database/database');
const groupModel = require('../model/groupsModel')


async function addGroupMember (adminId, idGroup, members_id) {
    let errors = []

    let group = await groupModel.getGroupByid(idGroup)

    if (!groupModel.isValidAdmin(group, adminId)){
        return addEntryToError(errors, "invalid_admin")
    }

    errors = await addMemberToGroup(errors, group, members_id)

    return errors
}

async function addMemberToGroup(errors, group, members_id) {

    members_id.forEach( async member_id => {
        if (isMemberAlreadyInGroup(group, member_id)) {
            addEntryToError(errors, "already_member", member_id);
            return;
        }

        let query = `INSERT INTO TB_members (id_group, id_client) VALUES(?, ?)`;
        let values = [group.id, member_id];
        
        await db.DBX().query(query, values);
    });

    return errors;
}


async function isMemberAlreadyInGroup(group, member_id) {
    let query = await db.DBX().query(`SELECT * FROM TB_members where id_group = ${group.id} and id_members = ${member_id}`)

    return query > 1
}

//HELPER ERROR FUNCTION, MAYBE MOVE TO UTILS AFTER
function addEntryToError(errorArray, errorKey, entry) {
    for (let i = 0; i < errorArray.length; i++) {
      if (errorArray[i][0] === errorKey) {
        if (entry !== undefined) {
          errorArray[i][1].push(entry);
        }
        return errorArray;
      }
    }

    if (entry !== undefined) {
      errorArray.push([errorKey, [entry]]);
    } else {
      errorArray.push([errorKey]);
    }
    return errorArray;
}

module.exports = {
    addGroupMember,
}
