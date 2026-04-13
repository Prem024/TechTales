import bcrypt from "bcryptjs";
console.log(await bcrypt.compare("12345678", "12345678"));
