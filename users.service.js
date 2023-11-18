import {UserModel} from "./models.js";

export const errorHandler = (res, e) => res.json({error: e.message})