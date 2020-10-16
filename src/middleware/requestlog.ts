import { Response, NextFunction, Request } from 'express';

/**
 * Middleware that logs request data and response status
 */
function requestLogger(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
        // Log data about the request and response once the response is finished sending
        console.info(`${req.method} ${req.path} ${res.statusCode}`);
    });
    next();
};

export default requestLogger;
