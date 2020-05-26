import jwt from 'jsonwebtoken';
// change secretPhrase to come from environment
const secretPhrase = "thegreatestsecret";
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
