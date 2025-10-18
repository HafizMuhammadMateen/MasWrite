const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;

// ==========================
// 👤 Username Validation
// ==========================
export function validateUsername(userName: string): string | null {
  if (!userName) return "Username is required.";
  if (userName.length < USERNAME_MIN_LENGTH) return `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
  if (userName.length > USERNAME_MAX_LENGTH) return `Username must not exceed ${USERNAME_MAX_LENGTH} characters.`;
  return null;
}

// ==========================
// 📧 Email Validation
// ==========================
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}

// ==========================
// 🔐 Password Validation
// ==========================
export function validatePassword(password: string, isSignup: boolean = false): string | null {
  if (!password) return "Password is required.";

  // Apply stricter checks on signup
  if (isSignup) {
    if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/\d/.test(password)) return "Password must contain at least one number.";
  }

  return null;
}
