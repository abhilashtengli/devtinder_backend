const express = require("express");
const { userAuth } = require("../middlerware/auth");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constants");
const {
  validateWebhookSignature
} = require("razorpay/dist/utils/razorpay-utils");
const { z } = require("zod");
const User = require("../models/user");

const validInput = z.object({
  memberShipType: z.enum(["Basic", "Premium"])
});
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const body = req.body;
    const result = await validInput.safeParse(body);
    if (!result.success) {
      return res.json({
        message: "Invalid membership Type",
        error: result.error.errors
      });
    }
    const loggedInUser = req.user;
    const { memberShipType } = result.data;

    const order = await razorPayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        Name: loggedInUser.firstName,
        emailId: loggedInUser.emailId,
        memberShip: memberShipType
      }
    });

    //save in the DB
    const paymentData = {
      userId: loggedInUser._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes
    };

    const payment = new Payment(paymentData);
    const savedPayment = await payment.save();
    // return orderDetails to FE
    return res.json({
      data: savedPayment,
      key_ID: process.env.RazorPay_Key_ID
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RazorPay_webhook_secret
    );
    if (!isWebhookValid) {
      res.status(400).json({
        message: "Invalid webhook signature"
      });
    }
    //Update payment status in the Database
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id
    });
    payment.status = paymentDetails.status;
    await payment.save();
    const user = await User.findOne({
      _id: paymentDetails.userId
    });
    user.isPremium = true;
    user.memberShipType = paymentDetails.notes.memberShipType;
    await user.save();
    //Update user membership status
    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }
    // return success response to razorpay (mandatory)
    return res.status(200).json({
      message: "Webhook received deatils successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = paymentRouter;
