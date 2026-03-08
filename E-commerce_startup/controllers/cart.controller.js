const getCartUserById = (req, res) => {
    const { id } = req.params
    res.send(`Fetching cart for user with id ${id}`)
}


const addCartUserById = (req, res) => {
    const { id } = req.params
    res.send(`Adding product to cart for user with id ${id}`)
}

module.exports = {
    getCartUserById,
    addCartUserById
}