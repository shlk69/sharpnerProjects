const getProducts = (req, res) => {
    res.send("Fetching all products")
}
const getProductsById = (req, res) => {
    const {id} = req.params
    res.send(` Fetching a product with id ${id}`)
}
const addProduct = (req, res) => {
    res.send("Adding a product to the cart")
}



module.exports = {
    getProducts,
    getProductsById,
    addProduct
}