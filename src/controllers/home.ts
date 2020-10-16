import { Request, Response } from 'express';

/**
 * Home page
 * @route GET /
 */
export function index(req: Request, res: Response) {
    return res.render('index');
};
