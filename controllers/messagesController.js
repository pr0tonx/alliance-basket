const {Message} = require('../models/Message');

const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');
const EnumMismatchException = require('../error/EnumMismatchException');
const SupportRequestResolvedException = require('../error/SupportRequestResolvedException');
const EmptyException = require('../error/EmptyException');

const createFirstMessage = async function (firstMessage, transaction) {
  try {
    return await Message.create(firstMessage, transaction);
  } catch (err) {
    if (err instanceof RequiredFieldException
      || err instanceof InvalidFieldException
      || err instanceof EnumMismatchException
      || err instanceof InvalidFieldLengthException
      || err instanceof SupportRequestResolvedException) {
      throw err;
    }
    throw err
  }
}

const createMessage = async function (messagePayload) {
  try {
    return await Message.create(messagePayload);
  } catch (err) {
    throw err;
  }
}

const getAllTicketsByClientId = async function (id) {
  const values = {from: id};

  try {
    return await Message.findAllByValues(values);
  } catch (err) {
    throw err;
  }
}

const getAllMessagesByUserId = async function (idChat) {
  try {
    const messages = await Message.findAllByValues({idChat});

    if (!messages) throw new EmptyException('Não há mensagens no ticket.');

    return messages;
  } catch (err) {
    if (err instanceof EmptyException) throw err;
    throw err;
  }
}

module.exports = {
  createFirstMessage,
  createMessage,
  getAllTicketsByClientId,
  getAllMessagesByUserId
}