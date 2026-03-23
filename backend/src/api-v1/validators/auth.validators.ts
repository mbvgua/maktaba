import joi from "joi";

export const registerUserSchema = joi.object({
  username: joi
    .string()
    .required()
    .alphanum()
    .lowercase()
    .min(3)
    .max(15)
    .messages({
      "string.base": "username must be a string",
      "string.required": "username is required",
      "string.alphanum":
        "username can only contain letters(a-z) and digits(0-9)",
      "string.lowercase": "username must be in lowercase",
      "string.min": "username must have a minimum of {#limit} characters",
      "string.max": "username must have a maximum of {#limit} characters",
    }),
  email: joi
    .string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net", "yahoo"],
      },
    })
    .messages({
      "string.base": "email must be a string",
      "string.required": "email is required",
      "string.email":
        "email can only have two domains, e.g 'example.com' whose suffix can only be either '.com', '.net' or '.yahoo'",
    }),
  password: joi
    .string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "password must be a string",
      "string.required": "password is required",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character. It must also be no less then 6 digits, but not exceeding 10",
    }),
});

export const loginUserSchema = joi.object({
  usernameOrEmail: joi.string().required().messages({
    "string.base": "username/email must be a string",
    "string.required": "username/email is required",
  }),
  password: joi
    .string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "password must be a string",
      "string.required": "password is required",
      "string.min":
        "password must have a minimum number of {#limit} characters",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
    }),
});

export const changePasswordSchema = joi.object({
  newPassword: joi
    .string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "password must be a string",
      "string.required": "password is required",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character. It must also be no less then 6 digits, but not exceeding 10",
    }),
});
