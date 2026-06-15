const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR :", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma specific error
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;