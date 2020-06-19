import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

import { environment } from '../common/environment';
import { validateCPF } from '../common/validators';

/**
 * Definicao para a collection Users
 * 
 * @see https://medium.com/chingu/an-overview-of-mongodb-mongoose-b980858a8994
 * @author Christian Murata
 */

export interface User extends mongoose.Document {
    name: String,
    email: String,
    password: String | undefined
}

export interface UserModel extends mongoose.Model <User> {
    findByEmail(email: String): Promise <User>;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 80
    },

    email:{
        type: String,
        unique: true,
        required: true,
        // validador regex
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },

    password: {
        type: String,
        select: false,
        required: true
    },
    
    gender: {
        type: String,
        required: false,
        // valores valido para esse atributo
        enum: ['Male', 'Female']
    },

    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
    
    .then(hash => {
        obj.password = hash;

        next();
    })

    .catch(next);
}

const saveMiddleware = function(next) {
    const user: User = this;

    if(!user.isModified('password')){
        next();
    }
    
    else{
        hashPassword(user, next);
    }
}

const updateMiddleware = function(next) {
    if(!this.getUpdate().password){
        next();
    }
    
    else{
        hashPassword(this.getUpdate(), next);
    }
}

userSchema.pre('save', saveMiddleware);
userSchema.pre('update', updateMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);

userSchema.statics.findByEmail = function(email: string) {
    return this.findOne({ email });
}

export const User = mongoose.model <User, UserModel> ('User', userSchema);