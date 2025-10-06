export const validateUsername = (username: string): string => {
  if (!username) {
    return "Username required!";
  } else if (username.length < 3) {
    return "Username must be at least 3 characters!";
  } else if (username.length > 50) {
    return "Username must not be more than 50 characters!";
  }
  return "";
};

export const validateEmail = (email: string): string => {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return "Email required!";
  } else if (!emailRegex.test(email)) {
    return "Please enter a valid email address!";
  }
  return "";
};

export const validatePassword = (password: string, isSignup: boolean = false): string => {
  if (!password) {
    return "Password required!";
  }
  
  // stricter only on signup
  if (isSignup) {
    if (password.length < 8) {
      return "Password must be at least 8 characters!";
    } else if (!/[A-Z]/.test(password)) {
      return "Password must contain at least 1 capital letter!";
    } else if (!/\d/.test(password)) {
      return "Password must contain at least 1 digit!";
    }
  }
  
  return "";
};
