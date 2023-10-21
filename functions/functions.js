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

export { success, error };
