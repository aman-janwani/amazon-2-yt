// pages/orders.js

import moment from 'moment';
import { getSession, useSession } from 'next-auth/react';
import db from '../../firebase';
import Header from '../components/Header';
import Order from '../components/Order';
import Stripe from 'stripe';

function Orders({ orders }) {
  const { data: session } = useSession();

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>
        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders?.map(({ id, amount, amountShipping, items, timestamp, images }) => (
            <Order
              key={id}
              id={id}
              amount={amount}
              amountShipping={amountShipping}
              items={items}
              timestamp={timestamp}
              images={images}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10', // Replace with your desired API version
  });

  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  // Fetch orders from Firestore
  const stripeOrders = await db
    .collection('users')
    .doc(session.user.email)
    .collection('orders')
    .orderBy('timestamp', 'desc')
    .get();

  // Fetch line items for each order from Stripe
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => {
      const lineItems = await stripe.checkout.sessions.listLineItems(order.id, {
        limit: 100,
      });

      return {
        id: order.id,
        amount: order.data().amount,
        amountShipping: order.data().amount_shipping,
        images: order.data().images,
        timestamp: moment(order.data().timestamp.toDate()).unix(),
        items: lineItems.data,
      };
    })
  );

  return {
    props: {
      orders,
    },
  };
}
