const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: {type: String, 
        required: true, 
        max: 40
    },
    issues: [{type: Schema.Types.ObjectId,
        ref: "issue"
    }],
    date: {type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("project", ProjectSchema);