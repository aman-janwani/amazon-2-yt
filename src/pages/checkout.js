import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import Image from "next/image"
import Currency from "react-currency-formatter";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header"
import { selectItems, selectTotal } from "../slices/basketSlice";
import { groupBy } from "lodash";

//public key comes from next.config file which calls the env.local
//always have this line of code outside the function othwise it will load tons and tons of stripe data which is not needed
const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {

    const [session] = useSession();

    //items in the basket
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);

    const createCheckoutSession = async () => {
        const stripe = await stripePromise;

        //call the backend to create a checkout session
        const checkoutSession = await axios.post('/api/create-checkout-session', 
        {
            items: items,
            email: session.user.email
        });

        //redirect user to stripe Checkout page
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id
        });

        if(result.error) {
            alert(result.error.message);
        }
    };
    const groupedItems = Object.values(groupBy(items, "id"));
    return (
        <div className='bg-gray-100'>
            <Head>
                <title>Checkout | Amazon 2.0</title>
            </Head>
            <Header />

            <main className='lg:flex max-w-screen-2xl mx-auto'>
                {/* Left*/}
                <div className='flex-grow m-5 shadow-sm'>
                    <Image 
                        src="https://links.papareact.com/ikj"
                        width={1020}
                        height={250}
                        objectFit="contain"
                    />

                    <div className='flex flex-col p-5 space-y-10 bg-white'>
                        <h1 className='text-3xl border-b pb-4'>
                            {items.length === 0 ? 'Your cart is Empty' : 'Shopping Cart'}
                        </h1>

                        {/*Always with map have a unique key here we re using i i.e index of the array*/}
                        {groupedItems.map((group, i) => (
                            <div
                                key={group[0].image}
                                timeout={500}
                                className="item">
                                <CheckoutProduct
                                    id={group[0].id}
                                    title={group[0].title}
                                    rating={group[0].rating}
                                    price={group[0].price}
                                    description={group[0].description}
                                    category={group[0].category}
                                    image={group[0].image}
                                    hasPrime={group[0].hasPrime}
                                    quantity={group.length}
                                />
                            </div>
                        ))}

                    </div>
                </div>

                {/* Right*/}
                {items.length > 0 && (
                    <div className='flex flex-col bg-white p-10 shadow-md'>
                        
                            <>
                                <h2 className='whitespace-nowrap'>Subtotal 
                                    ({items.length} items) : {" "}
                                    <span className='font-bold'>
                                        <Currency quantity={total}  currency="INR"/>
                                    </span>
                                </h2>

                                <button 
                                    role="link" 
                                    onClick={createCheckoutSession}
                                    disabled={!session} 
                                    className={`button mt-2 ${!session && 'from-gray-300 to-gray-500 border-gray-200 cursor-not-allowed'}`}
                                    >
                                    {!session ? "Sign in to checkout" : "Proceed to checkout"}
                                </button>
                                
                            </>
                        
                    </div>
                )}
            </main>
        </div>
    )
}

export default Checkout

export async function getServerSideProps(context) {

    const session = await getSession(context);
  
    return { 
        props : { 
          session,
        },
    };
}