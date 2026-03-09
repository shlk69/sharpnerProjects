const getAllprods = () => {
    return "Fetching all products";
}

const getProdsById = (id) => {
    return `Fetching product with id : ${id}`;
}

const addProds = () => {
    return "Adding a new Product";
}

module.exports = {
    getAllprods,
    getProdsById,
    addProds
}