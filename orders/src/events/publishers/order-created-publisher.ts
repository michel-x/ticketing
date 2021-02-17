import {Publisher, OrderCreatedEvent, Subjects} from '@michelbtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}