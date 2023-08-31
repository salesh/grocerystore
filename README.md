

## Description

Grocery Store is a company that has stores in various locations in Serbia <br/>

Each node represents either the office (Vojvodina, Bezanija…) or store (Radnja 1,2…).  <br/>
There are two types of users: Employees and Managers. Both types can belong to any node.  <br/>
Managers can see and manage employees and managers that belong to their or descendant nodes.  <br/>


Example:
```
Manager that belongs to Novi Beograd sees and manages employees and managers who belong
to Novi Beograd, Bezanija and Radnja 6.
Employees can only see employees that belong to their or descendant nodes
```

Requirements:

Employees can only see employees that belong to their or descendant nodes. <br/>


There are a couple of approaches for implementing hierarchy in MongoDB <br/>
MongoDB allows different ways to model large hierarchical or nested data relationships.<br/>

1. Parent references
2. Child references
3. Array of ancestors
4. Materialized paths
5. Nested Sets
6. Combinations

Ultimately, the choice depends on factors such as the size of the hierarchy, the nature of the operations we will be performing, and the team's familiarity with the chosen model. <br/>
Different models have been used successfully in various applications, so it's important to evaluate what fits best for our specific use case. <br/>

I considered a large application with a deep hierarchy with a need for efficient reading and that needs to perform requested operations of querying all descendants of one office in order to find all employees for the requested office and their descendants. <br/>
Another important thing is that a check query is triggered whenever we need to interact with some office/store in order to check if we are trying to work with the office/store where we have permission.  <br/>

The Nested Sets pattern was chosen for the purpose of this task.  <br/>
The Nested Sets pattern provides a fast and efficient solution for finding subtree.  <br/>
The cost comes with the need to change the hierarchy, but this tradeoff looks acceptable in the assumption that we will not often change our structure.<br/>
One ability to do it would be remapping the whole structure and replacing all with new documents.<br/>

<p align="center">
<img src="https://github.com/salesh/grocerystore/assets/3098030/290af33d-25fe-4e5b-8123-1355f139f3aa">
</p>

This project implements
* Login API
* CRUD operations for Employee
* CRUD operation for Manager
* Retrieving all employees for one node
* Retrieving all employees for one node and all his descendants.
* Retrieving all managers for one node
* Retrieving all managers for one node and all his descendants.

All APIs (except Login API, require `access Bearer token` and query parameter `locationId`

Swagger is available on http://localhost:PORT/api 

Model of the system in the Mongo database
```
locations

_id,
name
left
right
type

users

_id
username
password

employees

_id
userId
locationId
role
name
```

The recommended index is putting the index on left and right values. <br/>
`await db.collection('locations').createIndex({ left: 1, right:1 });`

For the sake of testing, every user has the same hashed password. <br/>
This simple password will be shared through `onesecret` in an email - in order to respect the security perspective. <br/>

Migration will be handled automatically. <br/>
For dummy data please check `20230828083340-dummy-data.js` <br/>

For the production environment, appropriate clusterization can be implemented https://nodejs.org/api/cluster.html <br/>

## Scalability

To improve scalability we can create application instances for either office and their descendants or we can create each application instance per office/store - the appropriate API gateway would handle traffic. <br/>
Auto-scaling would help further to improve handling traffic. <br/>

## Installation

Please create `.env` file similar to `.env.example` <br/>
In case of using `docker-compose up` please adjust <br/>
`MONGODB_URL=mongodb://localhost:27017/groceryStore` to `MONGODB_URL=mongodb://mongodb:27017/groceryStore`

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Or run docker in development mode

```bash
# development
$ docker-compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
