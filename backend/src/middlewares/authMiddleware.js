const { verifyToken } = require(
  "../utils/jwtService"
);

// ======================
// AUTHENTICATE MIDDLEWARE
// ======================

const authenticate = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.message ||
        "Invalid token",
    });
  }
};

// ======================
// GLOBAL ERROR HANDLER
// ======================

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  return res.status(
    err.status || 500
  ).json({
    success: false,

    message:
      err.message ||
      "Internal server error",

    ...(process.env.NODE_ENV ===
      "development" && {
      stack: err.stack,
    }),
  });
};

module.exports = {
  authenticate,
  errorHandler,
};