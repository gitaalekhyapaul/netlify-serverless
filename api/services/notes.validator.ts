import Joi, { ValidationError } from "@hapi/joi";
import { CustomError } from "./errorHandler";
import { Request, Response, NextFunction } from "express";
import valid from "../model/noteValidation";

const postSchema: Joi.ObjectSchema = Joi.object({
  title: valid.titleSchema,
  author: valid.authorSchema,
  content: valid.contentSchema,
});

const patchSchema: Joi.ObjectSchema = Joi.object({
  id: valid.idSchema,
  content: valid.contentSchema,
}).unknown(true);

const deleteSchema: Joi.ObjectSchema = Joi.object({
  id: valid.idSchema,
});

const getSchema: Joi.ObjectSchema = Joi.object({
  id: valid.idSchema.optional(),
}).unknown(true);

const validator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result: any;
    switch (req.method) {
      case "POST":
        result = await postSchema.validateAsync(req.body);
        break;

      case "PATCH":
        result = await patchSchema.validateAsync(req.body);
        break;

      case "DELETE":
        result = await deleteSchema.validateAsync(req.query);
        break;

      case "GET":
        result = await getSchema.validateAsync(req.query);
        break;

      default:
        return res.sendStatus(405);
        break;
    }
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error("Validation Errors: ", error);
      next(new CustomError(400, "Bad Request."));
    }
  }
};

export default validator;
