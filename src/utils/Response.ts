export const ApiResponse = {
    success(data = null, message = "Success") {
      return {
        success: true,
        data,
        message
      };
    },
    error(message = "Internal Server Error", status = 500) {
      return {
        success: false,
        error: {
          message,
          status
        }
      };
    }
  };
  
