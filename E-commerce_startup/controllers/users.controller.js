const getAllUsers = (req, res) => {
    res.send("Fetching all users")
}

const addUser = (req, res) => {
    res.send("Adding a user")
}

const getUserById = (req, res) => {
    const { id } = req.params
     res.send('Fetching user with id ${id')
}

module.exports = {
    getAllUsers,
    addUser,
    getUserById
}