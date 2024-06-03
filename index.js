// XXXXXXX PREALABLE 

// imports NPM 
 import express from "express";
 import bodyParser from "body-parser";
 import { dirname } from "path";
 import { fileURLToPath } from "url";
 
 
// XXXXXXXXX CONSTANTES ET MIDDLEWARE
  const app = express();
  const port = 3000;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
 
// let and objets utiles 
  const correctPassword = "badiste"; 
  let password = "wrong" ;
  let dataArticles = [];
  let countSubm = 0 ;
  let dataIndex = -1

// Constructor function 
function WriteArticle (artID, date, author, title, body ) {
  this.artID = artID ; 
  this.date = date ; 
  this.author = author; 
  this.title = title; 
  this.body = body;
}

// function creation d'un nouvel article de blog 
function newArtData(req, dataArticles, countSubm) {
  let artDate =new Date().toDateString();
  let newData = new WriteArticle(
      countSubm,
      artDate,
      req.body["author"],
      req.body["title"],
      req.body["body"],
  ); 
  dataArticles.push(newData) ;
}

// Register some articles 
let data0 = new WriteArticle (
    countSubm,
    "19the of march 2023", 
    " Bad Kennedy ",
    "There is not conflict in badminton 🕊️", 
    `There is no strife, no prejudice, no national conflict in badminton. Its hazards are hostile to us all. Its conquest deserves the best of all mankind, and its opportunity for peaceful cooperation many never come again. But why, some say, badminton ? Why choose this as our goal? And they may well ask why climb the highest mountain? Why fly the Atlantic? Why does Rice play Texas?
    We choose to play badminton. We choose badminton , not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too.
    It is for these reasons that I regard the decision last year to shift our efforts in sport from low to high gear as among the most important decisions that will be made during my incumbency in the office of the Presidency of Badminton Kingdom.
    In the last 24 hours we have seen facilities now being created for the greatest and most complex exploration in bad's history. We have felt the ground shake and the air shattered by the testing of a new Raquete, many times as powerful as the previous one, generating power equivalent to 10,000 automobiles with their accelerators on the floor.
    `,
)
dataArticles.push(data0);
countSubm++ ; 
  
let data1 = new WriteArticle (
  countSubm,
  "20the of may 2024", 
  "Bad Borman", 
  "The view of badminton from the moon 🌔",
  `The view of Badminton from the moon fascinated me - a small game, 240,000 mniles away. 
  It was hard to think that that little thing held so many problems, so many frustrations:  
  Raging raquetes, bad birdies, silly competition don't show from that distance. 
  I'm convinced that some wayward stranger in a space-craft, coming from some other part of the heavens, could look at earth and never know that badminton exists at all. 
  But the samw wayward stranger would certainly know instinctively that if the earth were inhabited, then the destinies of all who lived on it must inevitably be interwoven and joined and sports. 
  We are one hunk of ground, water, air, clouds and badminton birdies, floating around in space. From out there it really is 'one game'.
  `,
)  
dataArticles.push(data1);
countSubm++; 


// XXXXXXXXXXXX   GET REQUEST 
  // get request towards HOME page 
    app.get("/", (req, res) => {
      res.render(__dirname + "/views/index.ejs")
    });
    app.get("/home", (req, res) => {
      res.redirect("/")
    });
  // get request towards AUTHENTIFICATION -> in order to get to WRITEARTICLE     
    app.get("/writearticle", (req, res) => {
      console.log(countSubm); 
      if (password == correctPassword) {
        // console.log("stored password "+ password+" is equal to true password : "+correctPassword); 
        res.render(__dirname +"/views/writearticle.ejs"); 
      } else {
      // console.log("stored password"+ password+"is different from true password : "+correctPassword); 
        res.redirect("/authent")
      }
    });
    app.get("/password/submit", (req, res)=> {
      res.render(__dirname + "/views/authent.ejs", {password})
    })
    app.get("/authent", (req, res) => {
      if (password == correctPassword) {
        // console.log("stored password "+ password+" is equal to true password : "+correctPassword); 
        res.render(__dirname +"/views/writearticle.ejs");
      } else {
        // console.log("stored password"+ password+"is different from true password : "+correctPassword); 
       res.render(__dirname + "/views/authent.ejs",{password} )
      }
    });
  // get request towards the blog page   
    app.get("/blog", (req, res) => {
      res.render(__dirname + "/views/blog.ejs", {dataArticles}
      )}
    );

// XXXXXXXXXXXX   POST REQUEST 
  // post Request on the PASSWORD form, towards WRITE ARTICLE  
    app.post("/password/submit", (req, res) => {
      password = req.body["password"] ; 
      if (password == correctPassword) {
        res.redirect("/writearticle")
      } else res.render(__dirname + "/views/authent.ejs", {password})
    }
    )
  // post Request on the WRITE Article form, towards the BLOG
    app.post("/writearticle/submit", (req,res) => {
      newArtData(req, dataArticles, countSubm); 
      countSubm++; 
      res.redirect("/blog") 
    })


  // post request from the blog/edit button => towards the editor Form 
    app.post("/blog/edit/:artID", (req, res) => {
    dataIndex = dataArticles.findIndex((x) => x.artID == req.params.artID); 
    let dataToEdit = dataArticles[dataIndex] ;
    // console.log(dataToEdit.author); 
    res.render(__dirname + "/views/editArticle.ejs", {dataToEdit, dataIndex});
    })

  //post request from the EDITarticles/ submit button 
    app.post("/editor/submit/:artID", (req, res) => {
      dataIndex = dataArticles.findIndex((x) => x.artID == req.params.artID); 
      function editData(req,dataArticles, dataIndex) {
          dataArticles[dataIndex] = { 
            artID : dataArticles[dataIndex].artID,
            date: dataArticles[dataIndex].date, 
            author: req.body["author"], 
            title: req.body["title"],
            body: req.body["body"],
          } 
        };
        editData(req,dataArticles,dataIndex); 
        console.log(dataArticles);
        res.redirect("/blog"); 
      })

  // DELETE DATA => TO BE DONE ! 


  // port 
  app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });