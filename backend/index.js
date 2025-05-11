const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Updated to bcryptjs
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");
const todoRoutes = require("./routes/todos");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        db.get(
          "SELECT * FROM users WHERE googleId = ?",
          [profile.id],
          (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            const newUser = {
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              googleId: profile.id,
            };
            db.run(
              "INSERT INTO users (email, firstName, lastName, googleId) VALUES (?, ?, ?, ?)",
              [newUser.email, newUser.firstName, newUser.lastName, newUser.googleId],
              function (err) {
                if (err) return done(err);
                newUser.id = this.lastID;
                done(null, newUser);
              }
            );
          }
        );
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

// Routes
app.post("/api/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName],
      function (err) {
        if (err) return res.status(400).json({ error: "Email already exists" });
        res.status(201).json({ message: "User created" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(401).json({ error: info.message });
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      res.json({ message: "Logged in", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    });
  })(req, res, next);
});
app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
});

app.use("/api/todos", todoRoutes);

passport.use(
  new (require("passport-local").Strategy)(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false, { message: "Invalid email" });
          if (!user.password) return done(null, false, { message: "Use Google login" });
          const match = await bcrypt.compare(password, user.password);
          if (!match) return done(null, false, { message: "Invalid password" });
          done(null, user);
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
});  



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));