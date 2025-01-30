const mongoose = require ('mongoose'); 
const bcrypt = require ('bcryptjs'); 

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^.{8,}$/;
const BIRTH_DATE_PATTERN = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d{4}$/;


const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'User name is required'], 
        maxLength: [30, 'User name characters must be lower than 30'], 
        trim: true
    },

    email: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        required: [true, 'User email is required'], 
        match: [EMAIL_PATTERN, 'Invalid email']

    }, 

    password: {
        type: String, 
        required: [true, 'User password is required'], 
        match: [PASSWORD_PATTERN, 'Invalid user password pattern']
    },

    biography: {
        type: String
    },

    birthDate: {
        type: Date, 
        match: [BIRTH_DATE_PATTERN, 'Invalid date']
    },
    
    avatar: {
        type: String, 
        default: function () {
            return `https://i.pravatar.cc/350?u=${this.email}`
        }, 
        validate: {
            validator: function (avatar) {
                try {
                    new URL (avatar); 
                    return true;
                } catch (e) {
                    return false; 
                }
                },
                message: function () {
                    return 'Invalid avatar URL'
                }
            }
        },
    }, {
        timestamps: true, 
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v; 
                delete ret._id; 
                delete ret.password; 
                ret.id = doc.id; 
                return ret; 
            }
        }
    }); 

    userSchema.pre('save', function (next){
        if (this.isModified('password')) {
            bcrypt.hash(this.password, SALT_WORK_FACTOR)
                .then ((hash) => {
                    this.password = hash; 
                    next(); 
                })
                .catch ((error) => next (error))
        } else {
            next(); 
        }
})

const User = mongoose.model('User', userSchema); 
module.exports = User; 
