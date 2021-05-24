import { groupBy } from "lodash";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
    const { items, email } = req.body;

    const groupedItems = Object.values(groupBy(items, "id"));

    const transformedItems = groupedItems.map((group) => ({
        description: group[0].description,
        quantity: group.length,
        price_data: {
            currency: "inr",
            unit_amount: group[0].price * 100, // Still don't really know here why we should times by 100 🤔
            product_data: {
                name: group[0].title,
                images: [group[0].image],
            },
        },
    }));
    
     const groupedImages = Object.values(
            groupBy(items.map((item) => path.basename(item.image)))
        ).map((group) => [group.length, group[0]]);


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_rates: ["shr_1IuA78SAWuMZCnIEkkI2EpUO"],
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA', "IN"]
        },
        line_items: transformedItems,
        mode: 'payment',
        success_url: "https://amazon-2-yt-roan.vercel.app/success",
        cancel_url: "https://amazon-2-yt-roan.vercel.app/checkout",
        metadata: {
            email,
            images: JSON.stringify(groupedImages),
        }
    });
    console.log("session created!", session.id);

    res.status(200).json({ id: session.id });
};
