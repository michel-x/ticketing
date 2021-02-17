import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('return a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

const createTicket = () => {
    const title = 'some title';
    const price = 20;

    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        });
}

it('can fetch a set of tickets', async () => {
    
    await Promise.all([
        createTicket(),
        createTicket(),
        createTicket()
    ]);

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3);
   
});

it('', async () => {
    
});

