import { validationResult } from "express-validator/check";

import commonConstants from "../constants/responseConstants";

const validationHandler = (req, res, next) => {
  const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return error.param + req.t(error.msg.key, error.msg.fields);
    },
  });
  const result = myValidationResult(req);
  if (!result.isEmpty()) {
    return res.status(commonConstants.ERROR400.CODE).json({
      message: result.array().join(" and "),
    });
  }
  return next();
};

export default validationHandler;
