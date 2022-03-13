import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  products: [{
    product: {
      type: Object, // we could define the full type instead of the `Object`
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

export const Order = model('Order', orderSchema);
