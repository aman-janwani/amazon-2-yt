// //YOU CAN GET FULL DOCUMENTATION ON STRIPE WEBHOOK

// import { buffer } from 'micro'
// import * as admin from 'firebase-admin'

// //Secure a connection to firebase from the backend
// const serviceAccount = require("../../../premissions.json");

// //as it is next js check if the app has already been initialized or not
// //to save for doing it again
// const app = !admin.apps.length ? admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// }) : admin.app();

// //Est a conn to stripe

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// const fulfillOrder = async (session) => {
//     //console.log('Fulfilling order', session)

//    //new addition from github
//    const images = JSON.parse(session.metadata.images).map((image) =>
//         JSON.stringify(image)
//     );

//    return app.firestore()
//    .collection('users')
//    .doc(session.metadata.email)
//    .collection('orders')
//    .doc(session.id).set({
//        amount: session.amount_total / 100,
//        amount_shipping: session.total_details.amount_shipping / 100,
//        images: images,
//        //images: JSON.parse(session.metadata.images),
//        timestamp: admin.firestore.FieldValue.serverTimestamp()
//    })
//    .then(() => {
//        console.log(`SUCCESS: Order ${session.id} has been added to firestore`);
//    })
//    .catch((err) => console.log("Error in insertion db !", err.message));
// }

// export default async (req, res) => {
//     if(req.method === 'POST') {
//         //this buffer is to store certififcate that the webhook will emit
//         //this cert tells us this is a verified stripe success event and not a fraud event
//         const requestBuffer = await buffer(req);
//         const payload = requestBuffer.toString();
//         const sig = req.headers["stripe-signature"];

//         let event;

//         //verify that the event came in from stripe and not from someplace else
//         try{
//             event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//         }
//         catch (err){
//             console.log("ERROR: ", err.message);
//             return res.status(400).send(`Webhook error: ${err.message}`);
//         }

//         //Handle the checkout.session.completed event i.e after success on stripe payment gateway
//         if(event.type === 'checkout.session.completed') {
//             const session = event.data.object;

//             //Fulfill the order -> push the data into firestore and show in orders
//             return fulfillOrder(session)
//             .then(() => res.status(200))
//             .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
//         }
//     }
// };

// //bodyParser: false bcoz 
// //we want the entire request as a stream and no a parsed object

// //externalResolver: true bcoz
// //the request is being resolved by stripe and not by us
// export const config = {
//     api: {
//         bodyParser: false,
//         externalResolver: true
//     },
// };
import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Disable the default body parser to access the raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fulfill the order: store order details in Firestore
const fulfillOrder = async (session) => {
  const images = JSON.parse(session.metadata.images).map(image => 
    typeof image === 'object' ? JSON.stringify(image) : image
  );

  return db
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: images,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} has been added to database`);
    })
    .catch((err) => {
      console.error('Error adding order to database:', err);
    });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_SIGNING_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the order
      return fulfillOrder(session)
        .then(() => res.status(200).send('Success'))
        .catch((err) =>
          res.status(400).send(`Webhook Error: ${err.message}`)
        );
    }

    // Return a response for other event types
    res.status(200).send('Event received');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
