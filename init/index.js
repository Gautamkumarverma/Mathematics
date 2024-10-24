const mongoose = require("mongoose");
const initData = require("./data.js");
const Student = require("../models/students.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/team";
main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URl);
}

const initDB = async () => {
  Student.deleteMany({});
  await Student.insertMany(initData.data);
  console.log("Database initialize");
};

initDB();
