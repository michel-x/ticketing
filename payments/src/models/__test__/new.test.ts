import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import {Order} from '../../models/order';
import {OrderStatus} from '@michelbtickets/common';
import { stripe } from '../../stripe';
import {Payment} from '../../models/payments';


it('return a 404 when purchasing and order that does not exists', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'kdkdk',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});


it('return a 401 when purchasing and order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'kdkdk',
            orderId: order.id
        })
        .expect(401);

});

it('return a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'kdkd'
        })
        .expect(400);
});

it('return a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201);

    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find((charge) => charge.amount === price * 100);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd');

    const payment = await  Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge?.id,
    });
    expect(payment).not.toEqual(null);
});