const Users = require("../models/Users");

module.exports.createData = async () => {
   const UserLength = await Users.find().countDocuments();

   try {
      if (UserLength == 0) {
         await Users.create({
            Fullname: "User",
            Email: "User@gmail.com",
            Phone: "00000000000",
            Password: "123qwe",
            isAdmin: true,
         });
         console.log("***** Create User *****");
      }
   } catch (error) {
      console.log(error);
   }
};
