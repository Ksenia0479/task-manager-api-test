const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const {
  sendWelcomeEmail,
  sendCancellationEmail
} = require("../emails/account.js");

const User = require("../models/user.js");
const auth = require("../middleware/auth.js");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });

    await user.save();
    const emailInfo = { to: user.email, receiverName: user.name };
    sendWelcomeEmail(emailInfo);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    user.tokens = user.tokens.concat({ token });

    await user.save();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send("The account hasn't found. Pleas authorize");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return !(token.token === req.token);
    });

    req.user.save();
    const { user, token } = req;
    res.send({ user, token });
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    req.user.save();

    const { user, token } = req;
    res.send({ user, token });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updateProperties = req.body;
  const allowedProperties = ["name", "age", "password", "email"];

  const isValidProperty = Object.keys(updateProperties).every(property =>
    allowedProperties.includes(property)
  );

  if (!isValidProperty) {
    return res.status(404).send("Invalid update property");
  }
  try {
    Object.keys(updateProperties).filter(updateProperty => {
      req.user[updateProperty] = updateProperties[updateProperty];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const emailInfo = { to: req.user.email, receiverName: req.user.name };
    sendCancellationEmail(emailInfo);

    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  limits: { fieldSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Supports only png/jpeg/jpg file formats!"));
    }
    cb(null, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save();
    res.status(201).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    // ???
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    // ???
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
