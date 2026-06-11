const stripeModule = require('stripe')

const getStripeClient = () => {
    const key = process.env.STRIPE_PRIVATE_KEY;
    if (!key) {
        return null;
    }
    return stripeModule(key);
};

const index = async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
        return res.status(503).json({ message: 'Payment service is not configured' });
    }
    try {
        const session = await stripe.paymentIntents.list({ limit: 100 });

        const paymentIntents = session.data;

        const paymentInfo = [];

        for (const paymentIntent of paymentIntents) {
            const paymentMethodId = paymentIntent.payment_method;
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

            // Extract card details
            const cardDetails = paymentMethod.card;
            const billingDetails = paymentMethod.billing_details;
            const expMonth = cardDetails.exp_month < 10 ? `0${cardDetails.exp_month}` : cardDetails.exp_month;
            const expYear = cardDetails.exp_year.toString().slice(-2); // Get the last two digits of the year

            const paymentData = {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                cardholderName: billingDetails.name,
                cardholderEmail: billingDetails.email,
                cardExp: `${expMonth}/${expYear}`,
                cardBrand: cardDetails.brand,
                cardNumber: `**** **** **** ${cardDetails.last4}`,
            };

            paymentInfo.push(paymentData);
        }

        res.status(200).json(paymentInfo);
    } catch (e) {
        // Console statement removed
        res.status(500).json({ error: e.message });
    }
}

const add = async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
        return res.status(503).json({ message: 'Payment service is not configured' });
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            payment_method_options: {
                card: {
                    restrictions: {
                        brands_blocked: ["american_express"],
                    },
                },
            },
            mode: "payment",
            customer_email: req.body.customer_email,
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            description: item.description,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${process.env.PUBLIC_APP_URL || process.env.CLIENT_URL || "http://localhost:3000"}/payments`,
            cancel_url: `${process.env.PUBLIC_APP_URL || process.env.CLIENT_URL || "http://localhost:3000"}/payments`,
        }, {
            apiVersion: "2025-02-24.acacia",
        });
        res.json({ url: session.url });
    } catch (e) {
        // Console statement removed
        res.status(500).json({ error: e.message });
    }
}

module.exports = { add, index }

