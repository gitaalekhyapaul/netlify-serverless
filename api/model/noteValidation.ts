import Joi from "@hapi/joi";
import { CustomError } from "../services/errorHandler";

export default {
  idSchema: Joi.string()
    .trim()
    .min(1)
    .required()
    .pattern(/^[0-9a-f]{24}$/)
    .error(
      new CustomError(
        422,
        "Validation failed. Parameter 'id' missing OR Invalid Note ID."
      )
    ),
  contentSchema: Joi.string()
    .trim()
    .min(1)
    .required()
    .error(
      new CustomError(422, "Validation failed. Parameter 'content' missing.")
    ),
  authorSchema: Joi.string()
    .trim()
    .min(1)
    .required()
    .error(
      new CustomError(422, "Validation failed. Parameter 'author' missing.")
    ),
  titleSchema: Joi.string()
    .trim()
    .min(1)
    .required()
    .error(
      new CustomError(422, "Validation failed. Parameter 'title' missing.")
    ),
};
