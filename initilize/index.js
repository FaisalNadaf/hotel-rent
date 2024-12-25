/** @format */

import { connect } from "mongoose";
import { data } from "./data.js";
import { deleteMany, insertMany } from "../models/listing.js";

let mongo_url = process.env.MONGO_URL;

main()
	.then(() => {
		console.log("mongodb connected");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	connect(mongo_url);
}

const initdb = async () => {
	await deleteMany({});
	data = data.map((obj) => ({
		...obj,
		owner: "65ec8343114743de6d5a285e",
	}));
	await insertMany(data);
	console.log("initilize new data");
};

initdb();
