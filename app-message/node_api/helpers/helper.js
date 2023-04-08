const HttpResponse = {
    // Success
    OK: 200,
    CREATED: 201,
    
    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
}



function toFormat(format = "YYYY-MM-DD"){
    let date_ob = new Date(Date.now());

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // return date to the specifique format
    if(format == "YYYY-MM-DD HH:MM:SS" ) return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds




    return year + "-" + month + "-" + date
}

// const helpers = {toFormat}
export { HttpResponse, toFormat };