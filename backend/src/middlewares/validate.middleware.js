export const validate = (validator) => (req, res, next) => {
  const errors = validator ? validator(req) : [];
  if (errors && errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  return next();
};