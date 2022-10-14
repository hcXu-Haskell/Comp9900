export const errorHandler = (
  error: any,
  callback: (message: string) => void
) => {
  if (error.response) {
    callback(
      error.response.data?.message ||
        "System error, please contact the website."
    );
  } else {
    console.error(error);
  }
};
