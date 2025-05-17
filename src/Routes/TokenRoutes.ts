import express, { Request, Response, NextFunction } from "express";
import { Token } from "../Model/Token";
import { auth } from "../middleware/auth";
const router = express.Router();

router.post("/add", auth, async (req, res) => {
  const { name, symbol, network, mintAddress } = req.body;
  const token = new Token({ name, symbol, network, mintAddress });
  await token.save();
  res.json({ message: "Token added!", token });
});


router.get("/list", async (req, res) => {
  const tokens = await Token.find();
  res.json(tokens);
});

router.put("/toggle/:id", auth, async (req:Request, res:Response):Promise<void> => {
  const token = await Token.findById(req.params.id);
  if (!token){

      res.status(404).json({ message: "Token not found" });
      return
  } 

  token.isActive = !token.isActive;
  await token.save();
  res.json({ message: `Token ${token.isActive ? "enabled" : "disabled"}!`, token });
});

export default router;