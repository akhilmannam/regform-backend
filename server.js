const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
require("dotenv").config();
const URL = process.env.DB;

app.use(cors());
app.use(express.json());

app.post("/user", async (req, res) => {
	try {
		let connection = await mongodb.connect(URL, {
			useUnifiedTopology: true,
		});

		//Select the particular DB
		let db = connection.db("form");

		//Do CRUD operation
		await db.collection("users").insertOne(req.body);

		//Close the connection
		await connection.close();

		res.json({
			message: "User Created",
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/users", async (req, res) => {
	try {
		let connection = await mongodb.connect(URL, {
			useUnifiedTopology: true,
		});
		let db = connection.db("form");
		let users = await db.collection("users").find().toArray();
		res.json(users);
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

app.get("/user/:id", async (req, res) => {
	try {
		let connection = await mongodb.connect(URL, {
			useUnifiedTopology: true,
		});
		let db = connection.db("form");
		let response = await db
			.collection("users")
			.findOne({ email: req.params.id });
		res.json(response);
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

app.put("/user/:id", async (req, res) => {
	try {
		let connection = await mongodb.connect(URL, {
			useUnifiedTopology: true,
		});
		let db = connection.db("form");
		await db
			.collection("users")
			.updateOne(
				{ _id: mongodb.ObjectID(req.params.id) },
				{ $set: req.body }
			);
		res.json({
			message: "User updated",
		});
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

app.delete("/user/:id", async (req, res) => {
	try {
		let connection = await mongodb.connect(URL, {
			useUnifiedTopology: true,
		});
		let db = connection.db("form");
		await db.collection("users").deleteOne({ email: req.params.id });
		res.json({
			message: "User Deleted",
		});
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

app.listen(process.env.PORT || 3001);
