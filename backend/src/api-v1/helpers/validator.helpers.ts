import { Request, Response } from "express";
import { logger } from "../../config/winston.config";

export async function validationHelper(
  request: Request,
  response: Response,
  schema: any,
) {
  /*
   * schema validation helper for DRY code!
   */

  // NOTE: you must destructure the `error` variable first
  // to ensure no errors. Else a `value` variable is always returned
  const { error } = await schema.validate(request.body);

  // if validation error exists,
  if (error) {
    // log occurrence
    logger.log({
      level: "error",
      message: "An error occurred while validating the request schema",
      data: { error },
    });

    // return error response
    return response.status(422).json({
      code: 422,
      status: "error",
      message: "An error occurred while validating the request schema",
      data: {
        path: error?.details[0].path,
        error: error?.details[0].message,
      },
      metadata: null,
    });
  } else {
    // else continue execution
    return true;
  }
}
