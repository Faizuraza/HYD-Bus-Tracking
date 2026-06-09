const { z } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map((e) => ({
        field: e.path.slice(1).join("."), // slice off body/query/params prefix
        message: e.message,
      })),
    });
  }
};

module.exports = validate;
