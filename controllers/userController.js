const getUsers = (req, res) => {
    console.log("Got users!");
    res.send(`<h1>Got Users!</h1>`);
}

module.exports = {
    getUsers
}