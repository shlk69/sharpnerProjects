const sendErrResponse = (res, err) => {
    let statusCode = err.statusCode
    let message = err.message

    return res.status(statusCode).json({
        message: message,
        status:false
    })
}

const sendResponse = (res, data,statusCode) => {
      return res.status(statusCode).json({data:data,status:true})
}

module.exports = {
    sendErrResponse,
    sendResponse
}