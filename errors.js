class RequiredArgumentError extends Error{
    constructor(message) {
        super(message);
        this.name = "RequiredArgumentError";
    }
}
class RequiredPropertyError extends Error{
    constructor(message) {
        super(message);
        this.name = "RequiredPropertyError";
    }
}
class WrongIpFormat extends Error{
    constructor(message) {
        super(message);
        this.name = "WrongIpFormat";
    }
}
class WrongCidrFormat extends Error{
    constructor(message) {
        super(message);
        this.name = "WrongCidrFormat";
    }
}
class WrongArgumentTypeError extends Error{
    constructor(message) {
        super(message);
        this.name = "WrongArgumentTypeError";
    }
}


module.exports = {
    RequiredArgumentError,
    RequiredPropertyError,
    WrongIpFormat,
    WrongCidrFormat,
    WrongArgumentTypeError
}