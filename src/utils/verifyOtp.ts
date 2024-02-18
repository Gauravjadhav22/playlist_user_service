const verifyOtp = (otp, storedOTP, email, expirationTimestamp) => {
  const currentTimestamp = Date.now();

  if (
    otp &&
    storedOTP &&
    otp === storedOTP &&
    currentTimestamp < expirationTimestamp
  ) {
    return true;
  } else {
    return false;
  }
};
