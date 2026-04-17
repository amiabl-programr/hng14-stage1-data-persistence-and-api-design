import { Request, Response, NextFunction } from 'express';

interface AppError {
  statusCode?: number;
  api?: string;
  message?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  
  if (err.statusCode === 502 && err.api) {
    console.error(`${err.api} returned an invalid response`, err);

    return res.status(502).json({
      status: 'error',
      message: "Unable to process request at this time",
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
