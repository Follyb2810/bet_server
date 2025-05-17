import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../Model/User";
import { Admin } from "../Model/Admin";
const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.body);
    const { password, email } = req.body;
    console.log(req.body);
    try {
      let user = await User.findOne({ email });
      console.log({ user });
      if (user) {
        res.status(400).json({ msg: "User exists" });
        return;
      }

      user = new User({
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
      }

      const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);
// const router = express.Router();

// Admin Registration (Run once)
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hashedPassword });
  await admin.save();
  res.json({ message: "Admin registered!" });
});

// Admin Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }
  const token = sign({ id: admin._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  res.json({ token });
});

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
  
//   // Validate credentials and generate access token and refresh token
//   const accessToken = generateAccessToken(user);  // Your logic for generating access token
//   const refreshToken = generateRefreshToken(user);  // Your logic for generating refresh token
  
//   // Set the tokens in HTTP-only cookies
//   res.cookie('access_token', accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
//     maxAge: 15 * 60 * 1000, // Access token expires in 15 minutes
//   });

//   res.cookie('refresh_token', refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
//     maxAge: 7 * 24 * 60 * 60 * 1000, // Refresh token expires in 1 week
//   });

//   res.json({ message: 'Login successful' });
// });

// app.post('/refresh-token', (req, res) => {
//   const refreshToken = req.cookies.refresh_token;

//   if (!refreshToken) {
//     return res.status(401).json({ message: 'No refresh token found' });
//   }

//   // Verify the refresh token
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    
//     // Generate new access token
//     const accessToken = generateAccessToken(user);

//     res.cookie('access_token', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 15 * 60 * 1000, // New access token expires in 15 minutes
//     });

//     return res.json({ message: 'Access token refreshed' });
//   });
// });


export default router;
