const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    project: {type: String,
        required: true
    },
    title: {type: String,
        required: true,
        max: 40
    },
    issue_text: {type: String,
        required: true,
        max: 240
    },
    author: {type: String,
        required: true,
        max: 40
    },
    status: {type: Boolean,
        default: true
    },
    status_text: {type: String,
        default: "open issue",
        max: 80
    },
    assigned_to: {type: String,
        default: "unassigned",
        max: 40
    },
    created_on: {type: Date,
        default: Date.now()
    },
    updated_on: {type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("issue", IssueSchema); 

