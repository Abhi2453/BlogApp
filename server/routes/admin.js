const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/**
 *
 * Check Login
 */
const app= express();
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * GET /
 * Admin - Login Page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render("admin/index", {
      locals,
      layout: adminLayout,
      success: null,
      error: null,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      // return res.status(401).json({ message: "Invalid credentials" });
      return res.redirect("/admin?error=Invalid%20credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid credentials" });
      return res.redirect("/admin?error=Invalid%20credentials");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/dashboard?success=Login%20Successful");
    // res.status(200).redirect("/dashboard", {
    //   success: "Login Successfully!",
    //   error: null,
    // });
  } catch (error) {
    console.log(error);
    return res.redirect("/admin?error=Something%20went%20wrong");
  }
});

/**
 * GET /
 * Admin Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };
    const success = req.query.success || null;
    const error = req.query.error || null;

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
      success,
      error,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/admin?error=Something%20went%20wrong");
  }
});

/**
 * GET /
 * Admin - Create New Post
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const success = req.query.success || null;
    const error = req.query.error || null;

    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
      success,
      error,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard?error=Something%20went%20wrong");
  }
});

/**
 * POST /
 * Admin - Create New Post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard?success=Post%20Added%20Successful");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard?error=Something%20went%20wrong");
  }
});

/**
 * GET /
 * Admin - Create New Post
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const success = req.query.success || null;
    const error = req.query.error || null;
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
      success,
      error,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard?error=Something%20went%20wrong");
  }
});

/**
 * PUT /
 * Admin - Create New Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}?success=Update%20Successful`);
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard?error=Something%20went%20wrong");
  }
});

// router.post('/admin', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if(req.body.username === 'admin' && req.body.password === 'password') {
//       res.send('You are logged in.')
//     } else {
//       res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * POST /
 * Admin - Register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard?success=Deleted%20Successful");
  } catch (error) {
    console.log(error);
    return res.redirect("/dahboard?error=Something%20went%20wrong");
  }
});

/**
 * GET /
 * Admin Logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //res.json({ message: 'Logout successful.'});
  res.redirect("/?success=Logout%20Successful");
});

module.exports = router;
