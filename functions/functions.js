function success(result) {
    return {
        status: 'success',
        result: result,
    };
}

function error(message) {
    return {
        status: 'error',
        message: message,
    };
}

module.exports = {
    success: success,
    error: error,
};
