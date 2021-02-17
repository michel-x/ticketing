import {TicketCreatedEvent} from '@michelbtickets/common';
import mongoose from 'mongoose';
import {TicketCreatedListener} from '../ticket-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    
    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        title: 'concert',
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg};
}

it('creates and saves the ticket', async () => {
    const {listener, data, msg} = await setup();

    // call the on Message function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the on Message function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created!
    expect(msg.ack).toHaveBeenCalled();
});