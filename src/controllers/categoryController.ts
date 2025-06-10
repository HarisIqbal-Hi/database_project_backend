import { Request, Response } from "express";
import * as categoryModel from "../models/categoryModel";

export async function listCategories(req: Request, res: Response) {
    const categories = await categoryModel.getCategories();
    res.json({ categories });
}
