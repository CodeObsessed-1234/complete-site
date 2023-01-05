const express = require("express");
const mysql = require('mysql');
const app = express();
const path = require('path');
const Port = process.env.PORT || 3000;


//creates coonection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nitin',
  database: 'login'
});


let isloggedin = false;

//creates table
function createTable() {
  console.log("in");
  connection.query("create table log(name varchar(20),usr varchar(50) primary key,pass varchar(50) not null)", (err, row, col) => {
    //  console.log(err);
  })

  connection.query("create table cart(name varchar(20),price float(20))", (err) => {
    // console.log(err);
  })
}

createTable();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "../views"));


// base root
app.get('/', (req, res) => {
  res.redirect('/main');
})




//get the main file html----------------------------
app.get('/main', (req, res) => {
  res.render('main', { login: `Login`, headingIntro1: `Leading Construction Company`, headingIntro2: `Around World` })
});
//*----------------------------------------------



//plan router
app.get("/plan", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/plans.html"));
});

app.get('/plans.html', (req, res) => {
  res.redirect("/plan")
});

app.post('/plansInserted', (req, res) => {
  // res.redirect("/main");
  let list = req.body.result.split(",");
  console.log("nitin", list);
  list.forEach(element => {
    let l = element.split(" ");
    let p = parseFloat(l[0]);
    connection.query(`insert into cart values('${l[1]}',${p})`, (err) => {
      console.log(err);
    })
  });
  res.send(list);

})


//after login and signup to the user page
var name;
app.get(`/main/usr`, (req, res) => {
  // console.log(name);
  if (name == undefined) {
    res.send("<h1>Page Not Found</h1>");
    return;
  }
  res.render('main', {
    channelName: `${name}`,
    login: ``,
    headingIntro1: ` Welcome "${name}"`,
    headingIntro2: `To Our Contruction World`

  })
})



//new usr Register------------------------------------

app.get('/accountPage', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/accountPage.html"));
})

//alternative of url accountPage
app.get('/accountPage.html', (req, res) => {
  res.redirect("/accountPage");
})

//insert into the database 
app.post("/accountPage", (req, res) => {
  console.log(req.body);
  console.log(req.body.password + " " + req.body.confirmPassword + req.body.name);
  if (req.body.password === req.body.confirmPassword) {
    console.log('in');
    connection.query(`insert into log values('${req.body.userName}','${req.body.email}','${req.body.password}')`, (err) => {
      if (err == null) {
        // isloggedin = true;
        name = req.body.userName;
        res.redirect('/main/usr')
      }
      else isloggedin = false;
    });
    return;
  }
  console.log("mismatch password");
  res.redirect('/accountPage')
})
//*-------------------------------------------------------



//check for login----------------------------------
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'))
});

//alternative of url
app.get('/login.html', (req, res) => { res.redirect('/login') })


app.post('/login', (req, res) => {

  let user = req.body.user;
  let password = req.body.pass;

  connection.query(`select * from log where usr='${user}' and pass='${password}'`, (err, row) => {

    let str = JSON.stringify(row);
    let json = JSON.parse(str);

    if (Object.keys(json).length > 0) {
      if (json[0].usr == user && json[0].pass == password) {
        console.log("logged In");
        isloggedin = true
        name = json[0].name;
        res.redirect(`/main/usr`);
      }
    }
    else {
      name = '';
      isloggedin = false;
      console.log("fialed");
      res.redirect('/login');
    }
  })
});




app.use('', (req, res) => {
  res.send("<h1>404 page not found</h1>")
})


app.listen(Port, () => {
  console.log(`server started and listning at port ${Port}`);
});
