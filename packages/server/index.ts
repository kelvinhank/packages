import { config } from "dotenv";
import helmet from "helmet";
import cors from "cors";
import responseTime from "response-time";
import { json, urlencoded } from "body-parser";
import { Request, Response, NextFunction, RequestHandler } from "express";
import RateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cleanup from "node-cleanup";

const bool = (val?: string | boolean) => String(val).toLowerCase() === "true";

export interface RawRequest extends Request {
  rawBody: string;
}

config();

export * from "@overnightjs/core";
export { slowDown, RateLimit, cleanup };
export { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Send an Express HTTP response from a JSON object
 * @param fn - Function to call for a response
 */
export const jsonAsyncResponse = (fn: RequestHandler) =>
  function asyncUtilWrap(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const fnReturn = fn(request, response, next);
    Promise.resolve(fnReturn)
      .then(result => {
        /**
         * You can resolve your controller method with:
         * (1) res.json(), it will return `undefined`
         * (2) return res.json(), it will return `Response`
         * (3) return {}, it will be a general object
         * (4) return string/number/other primitive
         *
         * To handle (3) onwards, make sure res.sendFile is not a method
         */
        if (
          (typeof result === "object" &&
            typeof result.sendFile === "undefined") ||
          [
            "boolean",
            "number",
            "string",
            "null",
            "undefined",
            "bigint",
            "symbol"
          ].includes(typeof result)
        ) {
          if (typeof result === "object" && result.status) {
            response.status(result.status);
            delete result.status;
          }
          response.json(result);
        }
      })
      .catch(next);
  };

/**
 * Setup required middleware in a Staart API app
 * @param app - Express app instance
 */
export const setupMiddleware = (app: any) => {
  if (!bool(process.env.DISALLOW_OPEN_CORS))
    app.use(
      cors({
        maxAge: process.env.CORS_MAXAGE
          ? parseInt(process.env.CORS_MAXAGE)
          : 600
      })
    );
  if (!bool(process.env.DISABLE_HELMET))
    app.use(
      helmet(
        process.env.HELMET_CONFIG
          ? JSON.parse(process.env.HELMET_CONFIG)
          : { hsts: { maxAge: 31536000, preload: true } }
      )
    );
  if (!bool(process.env.DISABLE_RESPONSE_TIME)) app.use(responseTime());
  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      verify: (request: RawRequest, response, buffer) => {
        if (request.query.raw) {
          request.rawBody = buffer.toString();
        }
      }
    })
  );
};
