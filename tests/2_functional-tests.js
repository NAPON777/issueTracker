const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);


suite("Functional Tests", function(){
    
    suite("POST api/issues/{project} => object with issue data", function(){
        
test("Every field filled in", function(done){
    chai.request(server)
    .post("/api/issues/test")
    .send({
        title: "Title",
        issue_text: "text",
        author: "Functional Tests - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "in QA"
    })
    .end(function(err, res){
assert.equal(res.status, 200);
assert.property(res.body, "title");
assert.equal(res.body.title, "Title");

assert.property(res.body, "title");
assert.equal(res.body.title, "Title");

assert.property(res.body, "issue_text");
assert.equal(res.body.issue_text, "text");

assert.property(res.body, "author");
assert.equal(res.body.author, "Functional Tests - Every field filled in");

assert.property(res.body, "assigned_to");
assert.equal(res.body.assigned_to, "Functional Tests - Every field filled in");

assert.property(res.body, "status_text");
assert.equal(res.body.status_text, "in QA");

done();
    });
});


test("required fields filled in", function(done){
    chai.request(server)
    .post("/api/issues/test")
    .send({
        title: "Title7",
        issue_text: "text7",
        author: "author7"
    })
    .end((err, res)=>{
assert.equal(res.status, 200, "status should be 200");

assert.property(res.body, "project", "should have a project property");
assert.equal(res.body.project, "test");
        
assert.property(res.body, "title", "should have a title property");
assert.equal(res.body.title, "Title7");

assert.property(res.body, "issue_text", "should have an issue_text property");
assert.equal(res.body.issue_text, "text7");

assert.property(res.body, "status_text", "should have a status_text property");
assert.equal(res.body.status_text, "open issue");

assert.property(res.body, "author", "should have an author property");
assert.equal(res.body.author, "author7");

assert.property(res.body, "status", "should have a status property");
assert.equal(res.body.status, true);

done();

    });
});


test("Missing required fields", function(done){
    chai.request(server)
    .post("/api/issues/test")
    .send({
        title: "title1",
        issue_text: "text1"
    })
    .end((err, res)=>{
        assert.equal(res.status, 400);
        assert.equal(res.text, "Make sure you provide a title, issue_text and author!");
        
        done();
    });
    
});

    });
    
    
suite("PUT /api/issues/{project}=>text", function(){
    
    test("no body", function(done){
        chai.request(server)
        .put("/api/issues/test")
        .send({})
        .end((err, res)=>{
            assert.equal(res.status, 400);
            assert.equal(res.text, "no body sent.");
            
            done();
        });
    });
    
    
test("One field to update", function(done){
    chai.request(server)
    .put("/api/issues/test")
    .send({
        _id:"123",
        issue_text: "put test"
    })
    .end((err,res)=>{
        assert.equal(res.status, 200);
    assert.equal(res.text, "successfully updated issue")
    
    done();
});
    
});


test("multiple fields to update", function(done){
    chai.request(server)
    .put("/api/issues/test")
    .send({
  _id: '123',
              assigned_to: 'Japon',
              title: 'put TITLE',
              status: false
    })
    .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.text, "successfully updated issue");
        
        done();
    });
});
    
});


suite("GET /api/issues/{project}=>Array of objects with issue data", function(){
    
    test("No filter", function(done){
        chai.request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res)=>{
            console.log(res.body[0]);
assert.equal(res.status, 200, "response status should be 200");
            
assert.isArray(res.body, "body should be an array");
assert.property(res.body[0], "title", "body should contain title field");

assert.property(res.body[0], 'issue_text', 'body should contain a issue_text');
          assert.property(res.body[0], 'created_on', 'body should contain a created_on');
          assert.property(res.body[0], 'updated_on', 'body should contain a updated_on');
          assert.property(res.body[0], 'author', 'body should contain an author');
          assert.property(res.body[0], 'assigned_to', 'body should contain a assigned_to');
          assert.property(res.body[0], 'status', 'body should contain a status_text');
          assert.property(res.body[0], 'status_text', 'body should contain a status_text');
          assert.property(res.body[0], '_id', 'body should contain an _id');
          done();

        });
    });
    
    
test("One filter", function(done){
    chai.request(server)
    .get("/api/issues/test")
    .query({assigned_to: "Japon"})
    .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'author' );
            assert.property(res.body[0], 'status');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].assigned_to, "Japon");
            assert.equal(res.body[0]._id, "123");
            
            done();
        
    });
});


test("Multiple filters(test for multiple fiels you know will be in the db for a return)", function(done){
chai.request(server)
            .get('/api/issues/test')
            .query({
              status_text: 'In QA',
              project: 'test'
                   })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.property(res.body[0], 'title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'author');
              assert.property(res.body[0], 'status');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              assert.equal(res.body[0].status_text, 'In QA');
              done();
});
   
   });
   
});


suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400, 'should receive error code');
            assert.equal(res.text, 'you did not provide an id.', 'should recieve an error message');
            done();
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: '5c59054e2389872c07f539c4'})
          .end((err, res) => {
            assert.equal(res.status, 200, 'should recieve error code');
            assert.equal(res.text, 'issue successfully deleted from the database', 'should recieve an error message');
            done();
          });
      });
      
    });
});