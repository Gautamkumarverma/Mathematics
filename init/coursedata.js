const mongoose = require("mongoose");
const Course = require("../models/course"); 

mongoose.connect("mongodb://localhost:27017/team");

const seedCourses = [
  {
    title: "CUET 2026 (Computer Special) Batch",
    description: "Live batch starting 17/06/25",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
    thumbnail: "https://via.placeholder.com/360x215.png?text=Course+1", 
    price: 999,
    discount: "20%",
    labels: ["LIVE CLASS", "FILES"],
  },
  {
    title: "JEE 2026 Foundation Course",
    description: "Targeting class 11th and 12th students",
    videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
  
    price: 1499,
    discount: "15%",
    labels: ["FILES"],
  },
  {
    title: "Board Exam Preparation 2025",
    description: "Complete theory + MCQ based revision",
    videoUrl: "https://www.youtube.com/embed/xvFZjo5PgG0",
    thumbnail: "https://via.placeholder.com/360x215.png?text=Board+Course",
    price: 799,
    discount: "10%",
    labels: ["LIVE CLASS"],
  },
  {
    title: "Board Exam Preparation 2025",
    description: "Complete theory + MCQ based revision",
    videoUrl: "https://www.youtube.com/embed/xvFZjo5PgG0",
    thumbnail: "https://via.placeholder.com/360x215.png?text=Board+Course",
    price: 799,
    discount: "10%",
    labels: ["LIVE CLASS"],
  },
  {
    title: "JavaScript for Beginners",
    description:
      "Master the fundamentals of JavaScript with real-world projects.",
    videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg",
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    price: 1200,
    discount: "₹ 300 OFF for new users",
    labels: ["VIDEOS", "PROJECTS"],
  },
  {
    title: "Full Stack Web Development Bootcamp",
    description: "Become a full-stack developer with MERN stack training.",
    videoUrl: "https://www.youtube.com/embed/nu_pCVPKzTk",
    thumbnail: "https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg",
    price: 4500,
    discount: "Summer Sale: ₹ 1,000 OFF",
    labels: ["LIVE CLASS", "FILES", "PROJECTS"],
  },
  {
    title: "Python + Machine Learning",
    description: "Learn Python and dive into ML with hands-on examples.",
    videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0",
    thumbnail: "https://img.youtube.com/vi/7eh4d6sabA0/maxresdefault.jpg",
    price: 3000,
    discount: "Extra ₹ 500 OFF for students",
    labels: ["PYTHON", "MACHINE LEARNING"],
  },
  {
    title: "CUET 2076 Maths Booster",
    description: "Crash course on Mathematics with advanced tricks.",
    videoUrl: "https://www.youtube.com/embed/IjJucP9r9tA",
    thumbnail: "https://img.youtube.com/vi/IjJucP9r9tA/maxresdefault.jpg",
    price: 2000,
    discount: "Flat ₹ 400 OFF",
    labels: ["CUET", "MATHS", "LIVE"],
  },
  {
    title: "React JS with Projects",
    description: "Master React from scratch with real-world mini projects.",
    videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    price: 2700,
    discount: "₹ 700 OFF for early birds",
    labels: ["REACT", "FRONTEND", "PROJECTS"],
  },
];

Course.insertMany(seedCourses)
  .then((res) => {
    console.log("Courses inserted:", res);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting courses:", err);
  });
