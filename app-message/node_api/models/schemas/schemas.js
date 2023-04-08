import Model from '../model.js';

class User extends Model{
    table = "users"
    constructor(){
        super();
    }
}

class Message extends Model{
    table = "messages"
    constructor(){
        super();
    }
}

class Contact extends Model{
    table = "contacts"
    constructor(){
        super();
    }
}

export {User,Message,Contact}