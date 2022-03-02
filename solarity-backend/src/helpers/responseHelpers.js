export const throwError = (message) => {
  let error = new Error(message);
  error.name = "Unable";
  throw error;
};

export const errorResponse = ({
  res,
  code = 500,
  message = "Something went wrong!",
  err = null,
}) => {
  if (err) {
    if (process.env.NODE_ENV !== "production") console.log(err);
    switch (err.name) {
      case "ValidationError":
        message = err.errors[0];
        break;
      case "Unable":
        message = err.message;
        break;
      // implement for case 'logout', meaning invalidate user mid session, log them out
    }
  }
  return res.status(code).json({ message });
};

export const successResponse = ({
  res,
  code = 200,
  response = { success: true },
}) => {
  res.status(code).json({ ...response, success: true });
};
