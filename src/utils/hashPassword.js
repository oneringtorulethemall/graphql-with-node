import bcrypt from 'bcryptjs';

const hashPassword = async (plainPassword) => {
    if (plainPassword.length < 8) {
        throw new Error("Password does not meet minimum length of 8 characters");
    }
    // add other checks here like
    // it has at least:
    //  1 upper case letter,
    //  1 lower case letter,
    //  1 of the following special characters !@#$
    //  1 numeric character
    //  optional 1 space character (can only be 1 if present)
    // return promise!
    return (bcrypt.hash(plainPassword, 10));
};


export default hashPassword;