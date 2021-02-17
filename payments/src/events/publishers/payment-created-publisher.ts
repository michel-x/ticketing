import {Subjects, Publisher, PaymentCreatedEvent} from '@michelbtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}