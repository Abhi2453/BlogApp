const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "BLOG APP",
    };
    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  const locals = {
    title: "ABOUT | PAVANKUMAR",
  };
  res.render("about", { locals });
});

router.get("/contact", (req, res) => {
  const locals = {
    title: "CONTACT",
  };
  res.render("contact", { locals });
});

router.get("/post/:id", async (req, res) => {
  try {
    let blog = req.params.id;
    const data = await Post.findById({ _id: blog });
    res.render("posts", { data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    console.log(searchTerm);
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", { data });
  } catch (error) {
    console.log(error);
  }
});

// function insertdata() {
//   Post.insertMany([
//     {
//       title: "How to Use NPM with NodeJS?",
//       body: "NPM (Node Package Manager) is an essential tool for managing NodeJS packages and dependencies, making development more efficient and scalable. It allows developers to install, update, and manage libraries easily, supporting both local and global installations. With features like version control, dependency management, and automation scripts, NPM enhances the development workflow.",
//     },
//     {
//       title: "How to Install Node.js on Windows?",
//       body: "Installing Node.js on Windows is a straightforward process, but it's essential to follow the right steps to ensure smooth setup and proper functioning of Node Package Manager (NPM), which is crucial for managing dependencies and packages.",
//     },
//     {
//       title: "Node.js HTTP Module",
//       body: "To use the HTTP server in the node, we need to require the HTTP module. The HTTP module creates an HTTP server that listens to server ports and gives a response back to the client.",
//     },
//     {
//       title: "Node.js Automatic Restart Server with Nodemon",
//       body: " It saves you time by eliminating the need to manually restart the server each time you update your code.",
//     },
//     {
//       title: "Node.js File System",
//       body: "The fs (File System) module in Node.js provides an API for interacting with the file system. It allows you to perform operations such as reading, writing, updating, and deleting files and directories, which are essential for server-side applications and scripts.",
//     },
//   ]);
// }

// insertdata();

module.exports = router;
