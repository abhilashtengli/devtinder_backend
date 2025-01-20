const express = require("express");
const { userAuth } = require("../middlerware/auth");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constants");
const { z } = require("zod");

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
    console.log("Request Body:", JSON.stringify(req.body));
    console.log("Membership Amount:", memberShipAmount[memberShipType]);

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

    console.log(order);

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
      data:  savedPayment ,
      key_ID: process.env.RazorPay_Key_ID
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = paymentRouter;
