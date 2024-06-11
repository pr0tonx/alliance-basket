const {Sequelize} = require('sequelize');

const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.json')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const {Tickets} = require('../models/Ticket');
const clientsController = require('./clientsController');
const messageController = require('./messagesController');

const EmptyException = require('../error/EmptyException');
const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const EnumMismatchException = require('../error/EnumMismatchException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');
const SupportRequestResolvedException = require('../error/SupportRequestResolvedException');

const createTicket = async function (req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {from, to} = req.body;

    const fromToIds = await findFromToIds(from, to);

    const ticketValues = {
      type: req.body.type,
      title: req.body.title
    };

    const ticket = await Tickets.create(ticketValues, {transaction});

    const firstMessage = {
      from: fromToIds.fromId,
      to: fromToIds.toId,
      message: req.body.message,
      idChat: ticket.dataValues.id,
      status: 'open'
    };

    const message = await messageController.createFirstMessage(firstMessage, {transaction});

    message.from = from;
    message.to = to;

    await transaction.commit();
    res.status(200).send({...ticket.dataValues, messages: [message.dataValues]});
  } catch (err) {
    await transaction.rollback();

    if (err instanceof RequiredFieldException
      || err instanceof InvalidFieldException
      || err instanceof EnumMismatchException
      || err instanceof InvalidFieldLengthException
      || err instanceof EmptyException
      || err instanceof SupportRequestResolvedException) {
      return res.status(400).send(err);
    }

    res.status(500).send({message: 'Something went wrong while creating a ticket', error: err});
  }
}

const createTicketMessage = async function (req, res) {
  const {id} = req.params;

  const {from, to, message} = req.body;

  try {
    const ticket = await Tickets.findOne({id: Number(id)});

    if (!ticket) throw new EmptyException('Ticket não existe.');

    const fromToIds = await findFromToIds(from, to);

    const messagePayload = {
      from: fromToIds.fromId,
      to: fromToIds.toId,
      message,
      status: ticket.dataValues.status,
      idChat: Number(id)
    }

    const messageResponse = await messageController.createMessage(messagePayload);

    messageResponse.from = from;
    messageResponse.to = to;

    res.status(200).send({...ticket.dataValues, messages: [messageResponse.dataValues]});
  } catch (err) {
    if (err instanceof EmptyException
      || err instanceof SupportRequestResolvedException) {
      res.status(400).send(err);
    }

    res.status(500).send({message: 'Something went wrong while trying to create a ticket message', error: err});
  }
}

const getAllTickets = async function (req, res) {
  try {
    const tickets = await Tickets.findAllTickets();

    return res.status(200).send(tickets);
  } catch (err) {
    res.status(500).send({message: 'Something went wrong while trying to get all tickets', error: err});
  }
}

const getAllOpenTicketsByClientId = async function (req, res) {
  const {id} = req.params;

  try {
    const ticketsById = await messageController.getAllTicketsByClientId(Number(id));

    const tickets = [];
    for (const {dataValues} of ticketsById) {
      const ticket = await Tickets.findOne({id: dataValues.idChat});

      if (ticket?.dataValues.status === 'open') tickets.push(ticket.dataValues);
    }

    res.status(200).send(tickets);
  } catch (err) {
    res.status(500).send({message: 'Something went wrong while trying to get all tickets by client id.', error: err});
  }
}

const updateTicketStatus = async function (req, res) {
  const {id} = req.body;

  try {
    const ticket = await Tickets.updateTicketStatus(id);

    return res.status(200).send(ticket);
  } catch (err) {
    if (err instanceof EmptyException
      || err instanceof RequiredFieldException
      || err instanceof InvalidFieldException) {
      return res.status(400).send(err);
    }

    res.status(500).send({message: 'Something went wrong while trying to change ticket status.', error: err});
  }
}

const getMessagesByTicketId = async function (req, res) {
  const {idChat} = req.params;

  try {
    const ticket = await Tickets.findOne({id: idChat});

    if (!ticket) throw new EmptyException('Ticket não encontrado.');

    const messagesResponse = await messageController.getAllMessagesByUserId(idChat);

    const fromId = messagesResponse[0].dataValues.from;
    const toId = messagesResponse[0].dataValues.to;

    const fromToEmails = await findFromToEmails(fromId, toId);

    const messages = [];
    for (const message of messagesResponse) {
      if (message.dataValues.from === fromId) {
        messages.push({...message.dataValues, from: fromToEmails.fromEmail, to: fromToEmails.toEmail});
      } else if (message.dataValues.to === fromId) {
        messages.push({...message.dataValues, from: fromToEmails.toEmail, to: fromToEmails.fromEmail});
      }
    }

    res.status(200).send({...ticket.dataValues, messages});
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err);
    }

    res.status(500).send({message: 'Something went wrong while trying to get messages by ticket id.', error: err});
  }
}

const findFromToIds = async function (from, to) {
  const fromId = await clientsController.getClientByEmail(from);
  const toId = await clientsController.getClientByEmail(to);

  if (fromId.length === 0) throw new EmptyException('Email do remetente não encontrado');
  if (toId.length === 0) throw new EmptyException('Email do destinatário não encontrado');

  return {fromId: fromId.dataValues.id, toId: toId.dataValues.id};
}

const findFromToEmails = async function (from, to) {
  const fromEmail = await clientsController.getClientById2(from);
  const toEmail = await clientsController.getClientById2(to);

  return {fromEmail: fromEmail.dataValues.email, toEmail: toEmail.dataValues.email};
}

module.exports = {
  createTicket,
  createTicketMessage,
  getAllTickets,
  getAllOpenTicketsByClientId,
  updateTicketStatus,
  getMessagesByTicketId
}