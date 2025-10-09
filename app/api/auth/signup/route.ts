import { validateEmail, validatePassword } from "@/utils/validators";
import { getUserByEmail, hashPassword, makeUser } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { userName, email, password } = await req.json();

    // Basic validation
    if (!userName || !email || !password) return error("⚠️ All fields are required", 422);

    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 400);
    
    const passwordError = validatePassword(password, true);
    if (passwordError) return error(passwordError, 400);
    
    // Check duplicates
    const existingUser = await getUserByEmail(email);
    if (existingUser) return error("⚠️ Email already registered" , 409); // Conflict error code

    const hashedPassword = await hashPassword(password);
    await makeUser(userName, email, hashedPassword);

    console.log("✅ User created", email);

    return success("✅ User created successfully", 201, { userName, email });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return error("❌ Something went wrong", 500);
  }
}
