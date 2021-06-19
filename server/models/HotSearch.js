const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String },
    rank: { type: Number },
    count: { type: Number, default: 0 },
    url: { type: String }
}, {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { createdAt: 'created_at' }
})
module.exports = mongoose.model('HotSearch', schema)