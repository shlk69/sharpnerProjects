const productServices = require('../services/product.service')

const getProducts = (req, res) => {
    res.send(productServices.getAllprods())
}
const getProductsById = (req, res) => {
    const{id} = req.params
    res.send(productServices.getProdsById(id))
}
const addProduct = (req, res) => {
    res.send(productServices.addProds())
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct
}