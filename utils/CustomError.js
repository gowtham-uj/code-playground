class CustomError extends Error {
  constructor(message, errorType) {
    super(
      JSON.stringify({
        areErrors: true,
        success: false,
        errorType,
        ...message,
      })
    );
    this.isCustomError = true;
    this.name = errorType;
    Error.captureStackTrace(this, CustomError);
  }
}

module.exports = CustomError;
