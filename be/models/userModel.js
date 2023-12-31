const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email: {
        type: String,
        unique: true,
        required : true,
        // validate: {
        //     validator: function(v) {
        //         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        //     },
        //     message: "Please enter a valid email"
        // },
    },
    password : {
        type: String,
        required : true
    },
    pic : {
        type: String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},
{
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// before saving the user, we will hash the password
userSchema.pre('save', async function(next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)
module.exports = User