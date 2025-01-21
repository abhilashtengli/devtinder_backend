# Notes

## RazorPay Payment Gateway Integration

### Steps 
1. Create an order
2. Order is created at RazorPay(RP) and RP will send back the orderId
3. The orderId is sent to Front End
4. Now user pays the amount
5. Then RP will send a payement status to backend using webhook (basically it will send a signature and we can verify) 


### Ref to validate signature (webhook)
- [https://razorpay.com/docs/webhooks/validate-test/](https://razorpay.com/docs/webhooks/validate-test/)
- [PaymentDetails to get from](https://razorpay.com/docs/webhooks/payloads/payments/)


## Real time chat with websocke (Socket.io)
- [Socket.io](https://socket.io/)
- BE Setup socket.io in backend npm install socket.io
- FE npm install socket.io-client