import jwt from 'jsonwebtoken';

// change secretPhrase to come from environment
const secretPhrase = process.env.JWT_SECRET;

const defaultExpiration = '7 days';
const generateJWT = (userID, expiresIn = defaultExpiration) => {
    //console.log('Expiration: ', expiresIn);
    return (
        jwt.sign(
            { userID },
            secretPhrase,
            { expiresIn: expiresIn }
        ));
}
export { generateJWT, secretPhrase };
