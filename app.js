const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
//mailchimp API : 4d9667c5089a6f31e7f6a7b041e8a1e6-us17
//mailchimp unique ID : 835dcdf54f
app.post("/",function(req,res){

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

const data = {
  members:[
    {
      email_address: email,
      status:"subscribed",
      merge_fields:{
        FNAME:firstName,
        LNAME:lastName
      }
    }
  ]
};

const jsonDATA = JSON.stringify(data);

const url = "https://us17.api.mailchimp.com/3.0/lists/835dcdf54f";

const options = {
  method : "POST",
  auth : "riteshdubey33:4d9667c5089a6f31e7f6a7b041e8a1e6-us17"
};

const request = https.request(url,options,function(response){
if(response.statusCode === 200){
  res.sendFile(__dirname+"/success.html");
}
else{
  res.sendFile(__dirname+"/failure.html");
}
response.on("data",function(data){
  console.log(JSON.parse(data));
})
});
request.write(jsonDATA);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){ //process is an object defined by heroku
  console.log("Server is running on port 3000");
});
