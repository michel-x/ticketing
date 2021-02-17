import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import {OrderStatus} from '@michelbtickets/common';
import {TicketDoc} from './ticket';

export {OrderStatus};

// An interface that describes the properties
// to create a new user
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// An interface that describes the properties that
// the user model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that the user document has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

const orderShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

orderShema.set('versionKey', 'version');
orderShema.plugin(updateIfCurrentPlugin);


orderShema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderShema);

export {Order};
