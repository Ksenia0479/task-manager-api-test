const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = process.env.MONGODB_URL;
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to Mongodb");
    }

    const db = client.db(databaseName);

    /* db.collection("users").insertMany(
      [{ name: "Ksenia", age: 25 }, { name: "Alex", age: 30 }],
      (error, result) => {
        if (error) {
          return console.log("Unable to connect with MongoDB");
        }
        result.ops;
      }
    );

    db.collection("tasks").insertMany(
      [
        { description: "some text", completed: true },
        { description: "some text", completed: false },
        { description: "some text", completed: "false" }
      ],
      (error, result) => {
        if (error) {
          return console.log("Unable to insert tasks");
        }
        result.ops;
      }
    ); */

    /* db.collection("tasks").findOne(
      {
        _id: new ObjectId("5d38af195ff9c3301d5eb57b")
      },
      (error, task) => {
        if (error) {
          return console.log(error);
        }
        console.log(task);
      }
    );

    db.collection("tasks")
      .find({ completed: false })
      .toArray((error, tasks) => {
        if (error) {
          return console.log(error);
        }
        console.log(tasks);
      }); */

    /* db.collection("tasks")
      .updateMany({ completed: false }, { $set: { completed: true } })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      }); */

    /* db.collection("tasks")
      .deleteMany({ description: "some text" })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      }); */
  }
);
