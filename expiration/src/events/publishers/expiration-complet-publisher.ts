import {Publisher, ExpirationCompleteEvent, Subjects} from '@michelbtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}