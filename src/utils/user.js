const getFirstName = (fullname) => {
    return fullname.split(' ')[0];
}

const isValidPassword = (password) => {
    if (password.length >= 8 &&
        !password.toLowerCase().includes('password'))
        return true;

    return false;
}

export { getFirstName, isValidPassword };