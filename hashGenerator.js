const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainPassword = "NewPassword123!"; // Your actual password

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("New hashed password:", hash);
    }
});
