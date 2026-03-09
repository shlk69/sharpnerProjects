const productServices = require('../services/product.service')
const path = require('path')

const getProducts = (req, res) => {
    res.sendFile(path.join(__dirname,"../view/products.html"))
}
const getProductsById = (req, res) => {
    const{id} = req.params
    res.send(productServices.getProdsById(id))
}
const addProduct = (req, res) => {
    // res.send(productServices.addProds())
    const data = req.body
    res.json({ value: data.productName })
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct
}