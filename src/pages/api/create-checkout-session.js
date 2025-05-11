import { groupBy } from "lodash";

//this is what will be called when we hit this endpoint -> api/create-checkout-session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const path = require("path");

export default async (req, res) => {
    //we are destructuring the object and storing them in
    // 2 var i.e items and email
    const { items , email } = req.body;

    //console.log(items, email);

    //transforming data into stripe format check: stripe checkout guide for accepting payment
    //here if you have logic for quantity put it in place of qty
    /*const transformedItems = items.map(item => ({ 
        description: item.description, 
        quantity: 1,
        price_data: { 
            currency: 'inr',
            unit_amount: item.price * 100,
            product_data: {
                name: item.title,
                images: [item.image]
            },
        }
    }));*/

    const groupedItems = Object.values(groupBy(items, "id"));
    const transformedItems = groupedItems.map((group) => ({
        description: group[0].description,
        quantity: group.length,
        price_data: {
            currency: "inr",
            unit_amount: group[0].price * 100, 
            product_data: {
                name: group[0].title,
                images: [group[0].image],
            },
        },
    }));


    // Instead of sending an array of multiple similar values, just group them to save space in session
    const groupedImages = Object.values(
        groupBy(items.map((item) => path.basename(item.image)))
    ).map((group) => [group.length, group[0]]);
    /*
        This gives us an array like this (shorter for storing into the session):
        [
            [2, "image_A.jpg"], // means "2 products with that same image"
            [1, "image_B.jpg"], // ...
            [6, "image_C.jpg"], // ...
        ]
    */

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        // shipping_rates: ['shr_1RNXBkSFbb3E0fhhMlO8BJtS'],
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA', 'IN']
        },
        line_items: transformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
            email,
            images: JSON.stringify(groupedImages),
            //images: JSON.stringify(items.map(item => item.image))
        },
    });

    console.log("session created!", session.id);
    res.status(200).json({ id: session.id });
};
