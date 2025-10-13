const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_MIN_LENTH = 3;
const USERNAME_MAX_LENTH = 50;
const PASSWORD_MIN_LENTH = 8;

export const validateUsername = (username: string): string | null => {
  if (!username) return "Username required!";
  else if (username.length < USERNAME_MIN_LENTH) return "Username must be at least 3 characters!";
  else if (username.length > USERNAME_MAX_LENTH) return `Username must not exceeds ${USERNAME_MAX_LENTH} characters!`;
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email required!";
  else if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address!";
  return null;
};

export const validatePassword = (password: string, isSignup: boolean = false): string | null => {
  if (!password) return "Password required!";
  if (isSignup) {  // stricter only on signup
    if (password.length < PASSWORD_MIN_LENTH) return `Password must be at least ${PASSWORD_MIN_LENTH} characters!`;
    else if (!/[A-Z]/.test(password)) return "Password must contain at least 1 capital letter!";
    else if (!/\d/.test(password)) return "Password must contain at least 1 digit!";
  }  
  return null;
};
