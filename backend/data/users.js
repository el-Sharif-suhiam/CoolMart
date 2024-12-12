import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@proshop.com",
    password: bcrypt.hashSync("proshoppassword", 12),
    isAdmin: true,
  },
  {
    name: "Eliot anderson",
    email: "eliot@proshop.com",
    password: bcrypt.hashSync("proshoppassword", 12),
    isAdmin: false,
  },
  {
    name: "Jane Romero",
    email: "jane155@proshop.com",
    password: bcrypt.hashSync("proshoppassword", 12),
    isAdmin: false,
  },
];

export default users;
