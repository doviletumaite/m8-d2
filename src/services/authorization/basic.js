import createHttpError from "http-errors";
import atob from "atob";
import authorsModel from "../authors/schema.js";

// middleware for auth
export const authorization = async (req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    next(createHttpError(401, "Authorization header needed"));
  } else {
    console.log(atob(req.headers.authorization.split(" ")[1]));
    const decodedPW = atob(req.headers.authorization.split(" ")[1]);
    const [name, password] = decodedPW.split(":");
    const author = await authorsModel.checkCredentials(name, password);
    console.log("author me", author);
    if (author) {
      console.log("author me", author);
      req.author = author;

      next();
    } else {
      next(createHttpError(401, "something wrong in your credentials :/"));
    }
  }
};
