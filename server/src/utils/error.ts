export class RequestError extends Error {
  status: string;
  isOperational: boolean;

  constructor(
    public status_code: number = 500,
    public message: string,
  ) {
    super(message);
    this.status = status_code.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
