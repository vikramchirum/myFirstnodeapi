class custom_error extends Error {
    constructor(message, status) {
        if (Array.isArray( message)) {            
            let concatenated = message.join(', ');
            super(concatenated);
            this.errors = message;
        }
        else {
            super(message);
            this.errors = [this.message];
        }
        this.status = status;
        this.name = 'custom_error';
    }
};

module.exports = custom_error;