import {Publisher, OrderCancelledEvent, Subjects} from '@michelbtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}