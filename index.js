const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join (__dirname, "/views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Mehedi$Hasan@@@'
  });


  let getRandomUser = () =>  {
    return [
      faker.string.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
      
    ];
  }


  
  

  
   app.get("/", (req, res) => {
    let q = `select count(*) from users`;
     try{
        connection.query(q, (err, result)=> {
          if(err) throw err;
          let count = result[0]["count(*)"]
          res.render("home.ejs", {count});
        });
      }catch(err) {
        console.log(err);
        res.send("some error in db");
      }

   });


   app.get("/users", (req,res) => {
     let q = `select * from users`;
     try{
      connection.query(q, (err, results)=> {
        if(err) throw err;
       
        res.render("show.ejs", {results});
      });
    }catch(err) {
      console.log(err);
      res.send("some error in db");
    }
   })



  app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let q =`SELECT * FROM users WHERE id='${id}'`;
    
    try{
      connection.query(q, (err, result)=> {
        if(err) throw err;
       console.log(result);
        res.render("edit.ejs",{ result: result[0] });
      });
    }catch(err) {
      console.log(err);
      res.send("some error in db");
    }
  });





  //update route//
  app.patch("/users/:id", (req,res) => {
    let { id } = req.params;
    let {password: formPass, username:newUsername} = req.body;
    let q =`SELECT * FROM users WHERE id='${id}'`;
    
    try{
      connection.query(q, (err, result)=> {
        if(err) throw err;
       let users = result[0];
       if(formPass != users.passward) {
        res.send("wrong password");  
       }else{
        let q2=`update users set username='${newUsername}' where id='${id}'`;
        connection.query(q2, (err, result) => {
             if(err) throw err;
             res.redirect("/users");
        });
       }
       
      });
    }catch(err) {
      console.log(err);
      res.send("some error in db");
    }
    
  }) ;



  //add new user//
  app.get("/users/new", (req, res) => {
    res.render("new.ejs");
  });
  
  app.post("/users/new", (req, res) => {
    let { username, email, passward } = req.body;
    let id = uuidv4();
    //Query to Insert New User
    let q = `INSERT INTO users (id, username, email, passward) VALUES ('${id}','${username}','${email}','${passward}') `;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        console.log("added new user");
        res.redirect("/users");
      });
    } catch (err) {
      res.send("some error occurred");
    }
  });
  app.get("/users/:id/delete", (req, res) => {
    let {id} = req.params;
    let q =`select * from users where id= '${id}'`;

    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let users = result[0];
        res.render("delete.ejs", { users });
      });
    } catch (err) {
      res.send("some error with DB");
    }

  });

  app.delete("/users/:id", (req, res) => {
    let { id } = req.params;
    let { passward } = req.body;
    let q = `SELECT * FROM users WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (user.passward !== passward) {
                res.send("Wrong password");
            } else {
                let q2 = `DELETE FROM users WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    console.log("Deleted!");
                    res.redirect("/users");
                });
            }
        });
    } catch (err) {
        res.send("Some error in db");
    }
});

     



    app.listen("7777", () => {
      console.log("server is listning to the port");
    });







    
    // try{
    //   connection.query(q, [data], (err, result)=> {
    //     if(err) throw err;
    //     console.log(result);
    //   });
    // }catch(err) {
    //   console.log(err);
    // }
    // connection.end();

