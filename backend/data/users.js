import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@coolmart.com",
    password: bcrypt.hashSync("adminpassword", 12),
    isAdmin: true,
  },
  {
    name: "Eliot anderson",
    email: "eliot@coolmart.com",
    password: bcrypt.hashSync("coolmartpassword", 12),
    isAdmin: false,
  },
  {
    name: "Jane Romero",
    email: "jane155@coolmart.com",
    password: bcrypt.hashSync("coolmartpassword", 12),
    isAdmin: false,
  },
  {
    name: "Random User",
    email: "user@coolmart.com",
    password: bcrypt.hashSync("coolmartpassword", 12),
    isAdmin: false,
  },
];

export default users;
