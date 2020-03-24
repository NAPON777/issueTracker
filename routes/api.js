/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


const expect = require("chai").expect;
const MongoClient = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const Issue = require("../models/Issue");

const CONNECTION_STRING = process.env.DB;

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true})
.then(()=>console.log("Connection Success."))
.catch((err)=>console.log("Error"));


module.exports = function(app){
    app.route("/api/issues/:project")
    .get(function(req, res){
        let project = req.params.project;
        let searchQuery = req.query;
        searchQuery.project = project;
        
if(searchQuery.status){
    searchQuery.status = (String(searchQuery.status) === "open");
};

let errors = {};

Issue.find(searchQuery)
.then(issues=>{
    if(!issues){errors.noissues = "no issues found";}
    res.json(issues);
})
.catch(err=>res.status(404).json(err));
    })
    .post(function(req, res, next){
        let project = req.params.project;
        let newIssue = req.body;
        newIssue.project = project;
        
// validate input before saving

if(!newIssue.title || !newIssue.author || !newIssue.issue_text){
res.status(400).send("make sure you provide an title, author and issue_text!");
return next();}

// sanitize newIssue

for(let ele in newIssue){
    if(!newIssue[ele]) delete newIssue[ele];
};

// now search and save

Issue.findOne({project: project,
    title: newIssue.title
})
.then(issue=>{
    if(!issue){ new Issue(newIssue)
    .save()
    .then(issue=>{console.log("issue successfully saved to the database");
        res.status(200).send(issue);
    })
    .catch(err=>res.status(400).send(err.message));}
    else {

// send the existing issue

res.json(issue);
    }
})
.catch(err=>res.status(400).send(err.message));

    })
    .put((req, res, next)=>{
      let project = req.params.project;
      let issue = req.body._id;
      
// if no req.body

if(Object.keys(req.body).length===0){
    res.status(400).send("no body sent.");
    return next();
}

delete req.body._id;
let updatedIssue = req.body;

// clean the updates

for(let ele in updatedIssue){
    if(!updatedIssue[ele]){
        delete updatedIssue[ele];}
};

(req.body.open)?(updatedIssue.status = false):(updatedIssue.status = true);

if(Object.keys(updatedIssue).length === 0){
    res.send("no updates sent.")
}
else{
    updatedIssue.updated_on = new Date();
    Issue.findOneAndUpdate({project: project, _id: issue}, updatedIssue, {new: true})
    .then(issue=>{
        if(!issue){
            res.status(400).send("no issue found")}
        else{
            res.status(200).send("successfully updated issue");}
    })
    .catch(err=>{res.status(404).send(err.message);});
    
};

    })
    
.delete(function(req, res, next){
    let project = req.params.project;
    
    if(Object.keys(req.body).length === 0 || !req.body.hasOwnProperty("_id")){
        res.status(400).send("you did not provide an id.");
        
        return next();
    }
    
Issue.findOne({_id: req.body._id})
   .deleteOne()
   .then(()=>{
       res.status(200).send("issue successfully deleted from the database")
   })
   .catch(err=>res.status(404).send("there was an error deleting the issue from the database"));
   
});

};


