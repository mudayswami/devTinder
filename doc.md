
authrouter
- POST /auth/signup
- POST /auth/login
- POST /auth/logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed- gets you the profiles of other users on platform


Status : Ignore, interested, accepted, rejected