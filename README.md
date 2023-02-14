# Littlejohn
This is a broking website simulator

## Docker
The simplest way to run the program is through docker:

1. `docker build -t little_john .`
2. `docker run -p 8080:8080 little_john`

## Usage

1. Clone the repo
2. run `npm install`
3. run `npm start`

In order to use the protected apis you have to generate a token

Run
```
curl -v -X POST http://localhost:8080/auth/login \
-d '{"username": "pippo", "password": "pluto" }' \
-H "Content-Type: Application/json"
```

This is a mocked API so any username or password you will insert, a valid token will be provided.

Then use the token to query the protected API.

```
 curl -v -X GET http://localhost:8080/tickers \
-H "Content-Type: Application/json" \
-u "<token>:"
```

## Env variables
There's the possibility to ad some optional environmental variables:

```
JWT_SECRET  // for setting up the secret for the Jwt token singing
HTTP_PORT   // for setting up the listening port
```

## Testing
To perform the automated tests run

```
npm test
```
