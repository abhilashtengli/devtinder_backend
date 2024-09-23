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
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed (Gets you the profile of other users)