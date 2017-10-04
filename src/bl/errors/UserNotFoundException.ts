class UserNotFoundException extends Error {
    constructor(public s: string) {
        super(s)
    }
}
