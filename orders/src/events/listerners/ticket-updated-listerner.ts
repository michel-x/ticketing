import {Message} from 'node-nats-streaming';
import {Subjects, TicketUpdatedEvent, Listener} from '@michelbtickets/common';
import {queueGroupName} from './queue-group-name';
import {Ticket} from '../../models/ticket';



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByIdEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const {title, price/* , version */} = data;
        ticket.set({title, price/* , version */});
        await ticket.save();

        msg.ack();
    }
}