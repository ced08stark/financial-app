import basicAuth, { BasicAuthResult } from "basic-auth";
import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const user: BasicAuthResult | undefined = basicAuth(req);

  if (
    user &&
    user.name === process.env.BASIC_AUTH_USER_NAME &&
    user.pass === process.env.BASIC_AUTH_USER_PWD
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
};

export default auth;
