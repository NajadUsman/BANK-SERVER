// import express
const express = require("express");

const dataService = require("./services/data.service");

// import jsonwebtoken

const jwt = require("jsonwebtoken");

// import cors
const cors=require("cors")

// craete an app using express

const app = express();

// use cors to specify origin

app.use(cors({
  origin:'http://localhost:4200'
}))

// to parse json

app.use(express.json());

// resolve http reqst from client
// GET=>to read data

app.get("/", (req, res) => {
  res.status(401).send("ITS A GET METHOD");
});

// POST-to create data
app.post("/", (req, res) => {
  res.send("ITS A POST METHOD");
});

// PUT-to update/modify data
app.put("/", (req, res) => {
  res.send("ITS A PUT METHOD");
});

// PATCH-to partially update/modify data
app.patch("/", (req, res) => {
  res.send("ITS A PATCH METHOD");
});

// DELETE-to delete data
app.delete("/", (req, res) => {
  res.send("ITS A DELETE METHOD");
});

//set up the port number

app.listen(3000, () => {
  console.log("server started at port no:3000");
});

// Application specific middleware

const appMiddleware = (req, res, next) => {
  console.log("application specific middleware");
  next();
};

// app.use(appMiddleware);

// to verify token=middleware

const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const data = jwt.verify(token, "supersecretkey123");
    req.currentAcno = data.currentAcno;
    next();
  } catch {
    res.status(422).json({
      statusCode: 422,
      status: false,
      message: "please log in",
    });
  }
};

// bank app-API

// register-API

app.post(`/register`, (req, res) => {
  dataService
    .register(req.body.acno, req.body.password, req.body.uname)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// login-API

app.post(`/login`, (req, res) => {
  dataService
    .login(req.body.acno, req.body.password, req.body.uname)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// deposite-API

app.post(`/deposite`, jwtMiddleware, (req, res) => {
  dataService
    .deposite(req.body.acno, req.body.password, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// withdraw-API

app.post(`/withdraw`, jwtMiddleware, (req, res) => {
 dataService.withdraw(
    req,
    req.body.acno,
    req.body.password,
    req.body.amt
  )
  .then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// transaction-API

app.post(`/transaction`, jwtMiddleware, (req, res) => {
 dataService.getTransction(req.body.acno)
 .then((result) => {
  res.status(result.statusCode).json(result);
});
});

// deleteAcc API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
  // asynchronous
  dataService.deleteAcc(req.params.acno)
 .then((result) => {
  res.status(result.statusCode).json(result);
});

})
