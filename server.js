var fs = require("fs");

var express = require("express");
var path = require("path");
var app = express();
//var PORT = 3000;
var PORT = process.env.PORT || 3000;
var notesData  = [];


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/notes",function(req,res){
    res.sendFile(path.join(__dirname,"public","notes.html"));
});

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"public","index.html"));
});
app.get("/api/notes",function(req,res){
    return res.sendFile(path.join(__dirname, "db/db.json"));
   
    
});




app.post("/api/notes",function(req,res){

    try {
        // reads the json file
        notesData = fs.readFileSync("./db/db.json", "utf8");
        console.log(notesData);
    
        // parse the data to get an array of objects
        notesData = JSON.parse(notesData);
        // Set new notes id
        req.body.id = notesData.length;
        // add the new note to the array of note objects
        notesData.push(req.body); // req.body - user input
        // make it string(stringify)so you can write it to the file
        notesData = JSON.stringify(notesData);
        // writes the new note to file
        fs.writeFile("./db/db.json", notesData, "utf8", function(err) {
          // error handling
          if (err) throw err;
        });
        // changeit back to an array of objects & send it back to the browser(client)
        res.json(JSON.parse(notesData));
    
        // error Handling
      } catch (err) {
        throw err;
        console.log(err);
      }
    
});


app.delete("/api/notes/:id",function(req,res){


    try {
        //  reads the json file
        notesData = fs.readFileSync("./db/db.json", "utf8");
        // parse the data to get an array of the objects
        notesData = JSON.parse(notesData);
        // delete the old note from the array on note objects
        notesData = notesData.filter(function(note) {
          return note.id != req.params.id;
        });
        // make it string(stringify)so you can write it to the file
        notesData = JSON.stringify(notesData);
        // write the new notes to the file
        fs.writeFile("./db/db.json", notesData, "utf8", function(err) {
          // error handling
          if (err) throw err;
        });
    
        // change it back to an array of objects & send it back to the browser (client)
        res.send(JSON.parse(notesData));
    
        // error handling
      } catch (err) {
        throw err;
        console.log(err);
      }
    
   



})



app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

