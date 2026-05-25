import bcrypt from "bcryptjs";

const password = "123456"

 const password_w = await bcrypt.hash(password, 10);

console.log(password_w)