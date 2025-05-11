## Starting

Clone repository to you local machine. cd to the app directory.
Copy .env.example and create another file in same level with name .env and fill the variables there.

## Installing packages

Copy the `.env.example` file to `.env`.
```shell
cp .env.example .env
```


## Running without `Docker`
To install all the necessary libraries run the command below:

```shell
npm install
```

## Migration

```shell
npm run migration:run
```

Call this command in order to run all migrations and to create the necessary tables in the database.
`Note` that the database must exists before you run the migrations.

## Running the app

If everything has gone successfuly so far now you can start the app calling this command:

```shell
npm run start:dev
```

## Tests

I covered only `user.service.ts` with tests just for demonstration

```shell
npm run test user.service
```

## Running using `Docker`

Make sure that the `Docker Desktop` is running in your machine.

```shell
docker-compose up
```

If everything goes well than the `app` is ready to handle requests in this url: `http://localhost:3333/`

Example `cURL`:

```json
curl --request POST \
  --url http://localhost:3333/user/create \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
	"firstName": "astrit",
	"lastName": "kurtishaj",
	"password": "astrit123",
	"email": "astrit2@test.com"
}'
```

You can see the API documentation after the app is running on: `your_local_url/api/v1/docs`
