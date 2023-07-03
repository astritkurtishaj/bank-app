## Starting

Clone repository to you local machine. cd to the app directory.
Copy .env.example and create another file in same level with name .env and fill the variables there.

## Installing packages

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

You can see the API documentation after the app is running on: `http://localhost:3005/api/v1/docs`
