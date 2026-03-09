
const onsubmitHandler = (e) => {
    e.preventDefault()
    const product = e.target.productName.value
    const obj = {
        "productName" : product
    }
    axios.post("http://localhost:302/products", obj).then((res) => {
        console.log(res.data);
        
    })
}