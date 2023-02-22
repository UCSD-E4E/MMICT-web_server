const login = (req, res) => {
    console.log("Logging in . . . !");
    res.send(`<h1>Logging in . . .</h1?`);
}

const signUp = (req, res) => {
    console.log("Signing up . . . !");
    res.send(`<h1>Signing up . . .</h1?`);
}

module.exports = {
    login,
    signUp
}