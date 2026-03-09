const { sendErrResponse, sendResponse } = require('../utils/response')

const getAllUsers = (req, res) => {
    const user = req.params.user
    if (user > 10) {
        return sendErrResponse(res,{message:"User Not found",statusCode:404})
    }
    return sendResponse(res,user,200)
}

const addUser = (req, res) => {
    const { name, email } = req.body
    if (!name || !email) {
        return sendErrResponse(res,({message:"Name or eMail is required",statusCode:400}))
    }

    const user = { id: 1, name, email }
    return sendResponse(res,user,201)
}
 

module.exports = {
    getAllUsers,
    addUser,
}