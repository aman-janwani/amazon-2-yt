function Footer() {
    return (
        <div className="flex flex-col">
            <div className="text-sm p-3 w-full flex justify-center bg-amazon_blue-light">
                <p className="link text-gray-300">Back To top</p>
            </div>
            <div className="max-w-full flex flex-col md:flex-row md:justify-around bg-amazon_blue text-white h-full pb-5">
                <div className="ml-5">
                    <h3 className="mt-4">Get to Know Us</h3>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="link">About Us</p>
                        <p className="link">Careers</p>
                        <p className="link">Press Releases</p>
                        <p className="link">Amazon Cares</p>
                        <p className="link">Gift a Smile</p>
                    </div>
                </div>
                <div className="ml-5">
                    <h3 className="mt-4">Contact With Us</h3>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="link">Facebook</p>
                        <p className="link">Twitter</p>
                        <p className="link">Instagram</p>
                    </div>
                </div>
                <div className="ml-5">
                    <h3 className="mt-4">Make Money With Us</h3>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="link">Sell On Amazon</p>
                        <p className="link">Sell under Amazon Acceleration</p>
                        <p className="link">Amazon Global Selling</p>
                        <p className="link">Become an Affiliate</p>
                        <p className="link">Fulfilment By Amazon</p>
                        <p className="link">Advertise Your Product</p>
                        <p className="link">Amazon Pay on Merchants</p>
                    </div>
                </div>
                <div className="ml-5">
                    <h3 className="mt-4">Let us Help You</h3>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="link">COVID-19 and Amazon</p>
                        <p className="link">Your Account</p>
                        <p className="link">Return Center</p>
                        <p className="link">100% Purchase Protection</p>
                        <p className="link">Amazon App Download</p>
                        <p className="link">Amazon Assistant Download</p>
                        <p className="link">Help</p>
                    </div>
                </div>
            </div>
            <div className="flex text-sm p-3 space-x-3 w-full justify-center bg-amazon_blue">
                <p className="flex text-gray-300">Made By </p>
                <h1 className="link text-gray-300 font-bold">Aman Janwani</h1>
            </div>
        </div>
    )
}

export default Footer
