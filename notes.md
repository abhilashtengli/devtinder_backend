# RazorPay Payment Gateway Integration


### Steps 
1. Create an order
2. Order is created at RazorPay(RP) and RP will send back the orderId
3. The orderId is sent to Front End
4. Now user pays the amount
5. Then RP will send a payement status to backend using webhook (basically it will send a signature and we can verify) 


### Ref to validate signature (webhook)
- [https://razorpay.com/docs/webhooks/validate-test/](https://razorpay.com/docs/webhooks/validate-test/)
- [PaymentDetails to get from](https://razorpay.com/docs/webhooks/payloads/payments/)