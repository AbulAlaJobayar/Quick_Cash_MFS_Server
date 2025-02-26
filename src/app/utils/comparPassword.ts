import bcrypt from "bcrypt"
 const comparPassword = (password: string, hashedPassword: string) => {
    const trimmedPassword = password.trim(); // Trim whitespace
    const trimmedHashedPassword = hashedPassword.trim(); // Trim whitespace
    // console.log('Password:', trimmedPassword); // Debug log
    // console.log('Hashed Password:', trimmedHashedPassword); // Debug log
    const result = bcrypt.compareSync(trimmedPassword, trimmedHashedPassword);
    // console.log('Comparison Result:', result); // Debug log
    return result;
  };
  export default comparPassword