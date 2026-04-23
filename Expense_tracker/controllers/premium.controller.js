import { Cashfree, CFEnvironment } from "cashfree-pg";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// Create SDK instance (correct way)
const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

const createPremiumOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = "order_" + Date.now();

        const request = {
            order_amount: 99,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: String(userId),
                customer_phone: "9999999999",
                customer_name: "Test User",
                customer_email: "test@test.com"
            }
        };

        const response = await cashfree.PGCreateOrder(request);

        await Order.create({
            orderId,
            status: "PENDING",
            userId
        });

        res.status(200).json({
            paymentSessionId: response.data.payment_session_id,
            orderId
        });

    } catch (error) {
        console.log(
            "CREATE ORDER ERROR:",
            error.response?.data || error.message || error
        );

        res.status(500).json({
            error: error.message,
            details: error.response?.data
        });
    }
};

const verifyPremiumPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        const payment = await cashfree.PGOrderFetchPayments(orderId);

        const paymentStatus = payment.data?.[0]?.payment_status;

        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (paymentStatus === "SUCCESS") {
            await order.update({ status: "SUCCESSFUL" });

            await User.update(
                { isPremiumUser: true },
                { where: { id: userId } }
            );

            return res.json({ success: true });
        }

        await order.update({ status: "FAILED" });

        return res.json({ success: false });

    } catch (error) {
        console.log(
            "VERIFY PAYMENT ERROR:",
            error.response?.data || error.message || error
        );

        res.status(500).json({
            error: error.message,
            details: error.response?.data
        });
    }
};

export {
    createPremiumOrder,
    verifyPremiumPayment
};