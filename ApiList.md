# Devtinder API's

## authRouter
- POST /signup API
- POST /login API
- POST /logout API

## profileRouter
- GET  /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed (Gets you the profile of other users)