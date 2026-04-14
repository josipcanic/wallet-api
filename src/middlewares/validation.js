const Joi = require("joi");

const validate = (section) => (objSchema) => {
  const schema = Joi.object(objSchema);

  return (req, res, next) => {
    const { error, value } = schema.validate(req[section], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (!error) {
      req[section] = value;
      return next();
    }

    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => ({
        path: d.path.join("."),
        message: d.message,
      })),
    });
  };
};

module.exports = {
  body: validate("body"),
  params: validate("params"),

  usernameBody: Joi.string().trim().min(3).max(30).required(),
  passwordBody: Joi.string().min(8).max(128).required(),
  idParam: Joi.number().integer().positive().required(),
  amountBody: Joi.number().precision(2).positive().required(),
};
