
const mongodb = require('mongodb');

module.exports = {
  async up(db, client) {
    // Office and store migration
    await db.collection('locations').insertMany([
      { _id: "Srbija", name: "Srbija", left: 1, right: 46, type: "OFFICE" },
      { _id: "Vojvodina", name: "Vojvodina", left: 2, right: 25, type: "OFFICE" },
      { _id: "Severnobacki_okrug", name: "Severnobacki okrug", left: 3, right: 8, type: "OFFICE" },
      { _id: "Subotica", name: "Subotica", left: 4, right: 7, type: "OFFICE" },
      { _id: "Radnja_1", name: "Radnja 1", left: 5, right: 6, type: "STORE" },
      { _id: "Juznobacki_okrug", name: "Juznobacki okrug", left: 9, right: 24, type: "OFFICE" },
      { _id: "Novi_Sad", name: "Novi Sad", left: 10, right: 23, type: "OFFICE" },
      { _id: "Detelinara", name: "Detelinara", left: 11, right: 16, type: "OFFICE" },
      { _id: "Radnja_2", name: "Radnja 2", left: 12, right: 13, type: "STORE" },
      { _id: "Radnja_3", name: "Radnja 3", left: 14, right: 15, type: "STORE" },
      { _id: "Liman", name: "Liman", left: 17, right: 22, type: "OFFICE" },
      { _id: "Radnja_4", name: "Radnja 4", left: 18, right: 19, type: "STORE" },
      { _id: "Radnja_5", name: "Radnja 5", left: 20, right: 21, type: "STORE" },
      { _id: "Grad_Beograd", name: "Grad Beograd", left: 26, right: 45, type: "OFFICE" },
      { _id: "Novi_Beograd", name: "Novi Beograd", left: 27, right: 32, type: "OFFICE" },
      { _id: "Bezanija", name: "Bezanija", left: 28, right: 31, type: "OFFICE" },
      { _id: "Radnja_6", name: "Radnja 6", left: 29, right: 30, type: "STORE" },
      { _id: "Vracar", name: "Vracar", left: 33, right: 44, type: "OFFICE" },
      { _id: "Neimar", name: "Neimar", left: 34, right: 37, type: "OFFICE" },
      { _id: "Radnja_7", name: "Radnja 7", left: 35, right: 36, type: "OFFICE" },
      { _id: "Crveni_krst", name: "Crveni krst", left: 38, right: 43, type: "OFFICE"},
      { _id: "Radnja_8", name: "Radnja 8", left: 39, right: 40, type: "STORE" },
      { _id: "Radnja_9", name: "Radnja 9", left: 41, right: 42, type: "STORE" }
    ])


    // Users data
    await db.collection('users').insertMany([
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b02"),
        "username": "user2",
        "password": "user1_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b03"),
        "username": "user3",
        "password": "user3_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b04"),
        "username": "user4",
        "password": "user4_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b05"),
        "username": "user5",
        "password": "user5_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b06"),
        "username": "user6",
        "password": "user6_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b07"),
        "username": "user7",
        "password": "user7_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b08"),
        "username": "user8",
        "password": "user8_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b09"),
        "username": "user9",
        "password": "user9_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b0a"),
        "username": "user10",
        "password": "user10_hashed_password"
      },
      {
        "_id": new mongodb.ObjectId("613f0741fa3b240001e77b0b"),
        "username": "user11",
        "password": "user11_hashed_password"
      }
    ]);
    
    // Employees data
    await db.collection('employees').insertMany([
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c01"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b02"),
        "locationId": "Novi_Sad",
        "role": "MANAGER", 
        "name": "Alice"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c02"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b03"),
        "locationId": "Novi_Sad",
        "role": "EMPLOYEE",
        "name": "Bob"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c03"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b04"),
        "locationId": "Radnja_3",
        "role": "EMPLOYEE",
        "name": "Charlie"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c04"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b05"),
        "locationId": "Radnja_3",
        "role": "MANAGER", 
        "name": "David"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c05"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b06"),
        "role": "EMPLOYEE",
        "role": "Radnja_2",
        "name": "Eva"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c06"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b07"),
        "locationId": "Juznobacki_okrug",
        "role": "MANAGER", 
        "name": "Frank"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c07"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b08"),
        "locationId": "Novi_Beograd",
        "role": "MANAGER", 
        "name": "Grace"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c08"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b09"),
        "locationId": "Novi_Sad",
        "role": "EMPLOYEE",
        "name": "Hannah"
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c09"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b0a"),
        "locationId": "Radnja_2",
        "role": "MANAGER", 
        "name": "Isaac" 
      },
      {
        "_id": new mongodb.ObjectId("623f0741fa3b240001e77c10"),
        "userId": new mongodb.ObjectId("613f0741fa3b240001e77b0b"),
        "locationId": "Radnja_7",
        "role": "EMPLOYEE", 
        "name": "Jane"
      }
    
    ]);
  },

  async down(db, client) {
     await db.collection('locations').drop();
     await db.collection('employees').drop();
     await db.collection('users').drop();
  }
};
