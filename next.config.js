const withPWA = require("next-pwa");

module.exports = withPWA({
    pwa: {
    	dest: "public",
    	register: true,
    	skipWaiting: true,
    },

    images: {
        domains: ["links.papareact.com", "fakestoreapi.com", "lh3.googleusercontent.com"]
    },
    env: {
        stripe_public_key: process.env.STRIPE_PUBLIC_KEY
    }
});