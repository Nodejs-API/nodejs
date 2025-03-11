import { Request, Response } from "express";
import prisma from "../prisamClient";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.login.findMany({
      select: {
        id: true,
        userId: true,
        userEmail: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// sign up
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { userId, userEmail, userPw } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(userPw, 10);

    const newUser = await prisma.login.create({
      data: { userId, userEmail, userPw: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "Success, Sign up!", userId: newUser.userId });
  } catch (error) {
    res.status(500).json({ error: "Faild, Sign up.." });
  }
};

//login
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const { userId, userPw } = req.body;

  try {
    const user = await prisma.login.findUnique({
      where: { userId },
    });

    if (!user) {
      res
        .status(400)
        .json({ error: "Don't Exist Users. May be it is Ghost..!" });
      return;
    }

    const isMatch = await bcrypt.compare(userPw, user.userPw);
    if (!isMatch) {
      res.status(401).json({ error: "Unmatched retry!" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res
        .status(500)
        .json({ error: "Server misconfiguration: missing JWT secret" });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Success, Login!", token });
  } catch (error) {
    res.status(500).json({ error: "Faild, Login..." });
  }
};

//delete
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await prisma.login.delete({ where: { userId } });
    res.json({ message: "Completed, deleted users" });
  } catch (error) {
    res.status(500).json({ error: "Faild, deleted users" });
  }
};
