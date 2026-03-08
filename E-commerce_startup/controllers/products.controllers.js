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
const updateProductsById = (req, res) => {
    const {id} = req.params
    res.send("Updating a product")
}
const delProductsById = (req, res) => {
    const {id} = req.params
    res.send("Deleting a product ")
}


module.exports = {
    getProducts,
    getProductsById,
    updateProductsById,
    delProductsById,
    addProduct
}