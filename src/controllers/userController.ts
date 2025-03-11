import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
  res.json({ users: ["Alice", "Bob", "Charlie"] });
};
