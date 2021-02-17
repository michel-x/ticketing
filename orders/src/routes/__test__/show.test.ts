import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // meake a request to build an order with this ticket
    const {body: {id: orderId}} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make request to fetch the order
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(orderId);
});

it('returns an error if on user tries to fetch an another user order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // meake a request to build an order with this ticket
    const {body: {id: orderId}} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make request to fetch the order
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});