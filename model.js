const mongoose = require('mongoose');
const profileSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true
        },
        id: {
            type: String,
            unique: true
        },
        gender: String,
        gender_probability: Number,
        sample_size: Number,
        age: Number,
        age_group: String,
        country_id: String,
        country_probability: Number,
        created_at: String 
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Profile", profileSchema);