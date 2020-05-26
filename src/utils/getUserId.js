import jwt from 'jsonwebtoken';
import { secretPhrase } from '../utils/generateJWT';

if (!secretPhrase) {
    throw new Error("Unable to determine JWT required information.");
}

const getUserId = (request, requireAuth = true) => {

    const header = request.request ?
        // http/s path for authorization
        request.request.headers.authorization
        :
        // get from web socket (ws) when subscription is being used.
        request.connection.context.Authorization;

    if (header) {
        //console.log('header:', header);
        const token = header.replace('Bearer ', '');
        //console.log('token: ', token)
        const decoded = jwt.verify(token, secretPhrase);
        //console.log('decoded: ', decoded)
        return decoded.userID;
    }
    if (requireAuth) { throw new Error("Authentication Required.") }
    return null;
};

export default getUserId;
