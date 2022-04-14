const { use } = require("express/lib/application");
const { status } = require("express/lib/response");
// import jsonwebtoken
const jwt = require("jsonwebtoken");

// import User model

const db = require("./db");

// database = {
//   1000: {
//     acno: 1000,
//     uname: "NAJAD",
//     password: 1234,
//     balance: 50000,
//     transaction: [],
//   },
//   1001: {
//     acno: 1001,
//     uname: "FAVAS",
//     password: 2345,
//     balance: 30000,
//     transaction: [],
//   },
//   1002: {
//     acno: 1002,
//     uname: "AKASH",
//     password: 3456,
//     balance: 20000,
//     transaction: [],
//   },
// };

// register definition

const register = (acno, password, uname) => {
  // asynchronous

  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        statusCode: 422,
        status: false,
        message: "already exist !!! please log in",
      };
    } else {
      const newUser = new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction: [],
      });
      newUser.save();
      return {
        statusCode: 200,
        status: true,
        message: "successfully registered",
      };
    }
  });
};

// login definition

const login = (acno, password) => {
  // asynchronous

  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      currentAcno = acno;
      currentUname = user.uname;

      // token generation

      const token = jwt.sign(
        {
          currentAcno: acno,
        },
        "supersecretkey123"
      );

      return {
        statusCode: 200,
        status: true,
        message: "successsfully login!!!",
        currentAcno,
        currentUname,
        token,
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "incorect password or account number",
      };
    }
  });
};
// deposite definition

const deposite = (acno, password, amt) => {
  var amount = parseInt(amt);

  // asynchronous

  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      user.balance += amount;
      user.transaction.push({
        amount: amount,
        type: "CREDIT",
      });
      user.save();
      return {
        statusCode: 200,
        status: true,
        message:
          amount +
          " successfully deposit... and new balance is " +
          user.balance,
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "incorect password or account number",
      };
    }
  });
};

// withdraw definition

const withdraw = (req, acno, password, amt) => {
  var amount = parseInt(amt);
  var currentAcno = req.currentAcno;

  // asynchronous

  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      if (currentAcno != acno) {
        return {
          statusCode: 422,
          status: false,
          message: "operation denied",
        };
      }
      if (user.balance > amount) {
        user.balance -= amount;
        user.transaction.push({
          amount: amount,
          type: "DEBIT",
        });

        user.save();
        return {
          statusCode: 200,
          status: true,
          message:
            amount +
            " successfully debited... and new balance is " +
            user.balance,
        };
      } else {
        return {
          statusCode: 422,
          status: false,
          message: "insufficcient balance",
        };
      }
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "incorect password or account number",
      };
    }
  });
};

// transaction definition

const getTransction = (acno) => {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      };
    } else {
      return {
        statusCode: 402,
        status: false,
        message: "user does not exist",
      };
    }
  });
};

// deleteAcc API
const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user)
    {
      return {
        statusCode: 422,
        status: false,
        message: "operation failed",
      };
    }
  
      return {
        statusCode: 200,
        status: true,
        message:"The requsted account number "+acno+" delete successfully"
      };

  })
}


module.exports = {
  register,
  login,
  deposite,
  withdraw,
  getTransction,
  deleteAcc
};
