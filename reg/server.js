var express = require('express')
var cors = require('cors')
const pdf = require('html-pdf');
const pdfTemplate = require('./documents');
const users = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
const port = 4000;
const User = require('./models/User')
let Todo = require('./todo.model');
const Reminder = require('./category.model');
const remrouter = express.Router();
const Expense = require('./expense.model');
var localStorage = require('localStorage');
const businessRoutes = express.Router();
const router = express.Router();


app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

const mongoURI = 'mongodb://localhost:27017/expenseDB'

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})

//Namratha
const todoRoutes = express.Router();
app.use('/todos', todoRoutes);

var today = new Date();

var lastWeek = new Date();
var lastWeek1=lastWeek.toISOString();
today.setDate(today.getDate() - 7);
var today1=today.toISOString();
var lastMonthFromToday = new Date();
lastMonthFromToday.setMonth(today.getMonth() - 1);
var lastMonthFromToday1=lastMonthFromToday.toISOString();
var lastSixMonthFromToday = new Date();
lastSixMonthFromToday.setMonth(today.getMonth() - 6);
var lastSixMonthFromToday1=lastSixMonthFromToday.toISOString();



//lastMonthFromToday.setMonth(today.getMonth() - 1);



    todoRoutes.route('/Category').get(function(req, res) {
      console.log("email"+localStorage.getItem('email'))
        Expense.aggregate([
        {$match:{"email":localStorage.getItem('email')}},
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $match: {"_id":{$ne:null}}}
        
     ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
                console.log(todos)
            }
        });
    });



    todoRoutes.route('/month').get(function(req, res) {
        Expense.aggregate([
          {$match:{"email":localStorage.getItem('email')}},
            {$group:{
            _id:{ $month: "$date"},
            "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$date",new Date(lastSixMonthFromToday1)]}, {$lte:["$date",new Date(lastWeek1)]}]}, "$amount", 0]}}
            //"all":{$sum:"$Amount"}

        }},
        {
            $match: {"lastWeek": { $gt: 0 } }
          }
             ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
            }
        });
    });
    todoRoutes.route('/week').get(function(req, res) {
        Expense.aggregate([
          {$match:{"email":localStorage.getItem('email')}},
            {$group:{
            _id:{ $dayOfWeek: "$date"},
            "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$date",new Date(today1)]}, {$lte:["$date",new Date(lastWeek1)]}]}, "$amount", 0]}},
            //"all":{$sum:"$Amount"}

        }},
        {
            $match: {"lastWeek": { $gt: 0 } }
          }
             ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
                console.log(todos)
            }
        });
    });

    todoRoutes.route('/totalWeekSpending').get(function(req, res) {
        Expense.aggregate([
          {$match:{"email":localStorage.getItem('email')}},
            {$group:{
            _id:null,
            "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$date",new Date(today1)]}, {$lte:["$date",new Date(lastWeek1)]}]}, "$amount", 0]}},
            //"all":{$sum:"$Amount"}

        }},
        {
            $match: {"lastWeek": { $gt: 0 } }
          }
             ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
            }
        });
    });

    todoRoutes.route('/today').get(function(req, res) {
        Expense.aggregate([
            {$match:{"email":localStorage.getItem('email')}},
            {$group:{
            _id:null,
            "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$date",new Date(lastWeek1)]}, {$lte:["$date",new Date(lastWeek1)]}]}, "$amount", 0]}},
            //"all":{$sum:"$Amount"}

        }},
        {
            $match: {"lastWeek": { $gt: 0 } }
          }
             ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
            }
        });
    });
    
    todoRoutes.route('/total').get(function(req, res) {
        Expense.aggregate([
            {$match:{"email":localStorage.getItem('email')}},
            {$group:{
            _id:null,
            "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$date",new Date('2019-12-01T14:56:59.301Z')]}, {$lte:["$date",new Date(lastWeek1)]}]}, "$amount", 0]}}
            //"all":{$sum:"$Amount"}

        }},
        {
            $match: {"lastWeek": { $gt: 0 } }
          }
             ],function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
            }
        });
    });
    


   /* todoRoutes.route('/').get(function(req, res) {
      console.log(localStorage.getItem('email'))
        Expense.find(
    
            {
                email:localStorage.getItem('email'),
                budget:{$gt:0}
        } ,function(err, todos) {
            if (err) {
                console.log(err);
            } else {
                res.json(todos);
                 console.log(localStorage.getItem('email'))
                
            }
        });
    });*/



    // todoRoutes.route('/').get(function(req, res) {
    //     Todo.aggregate([{$group:{
    //         _id:"$Date",
    //         "lastWeek":{$sum:{$cond:[{$and:[{$gte:["$Date",new Date('2019-11-18T14:56:59.301Z')]}, {$lte:["$Date",new Date(lastWeek1)]}]}, "$Amount", 0]}}
    //         //"all":{$sum:"$Amount"}

    //     }},
    //     {
    //         $match: { "lastWeek": { $gt: 0 } }
    //       }
    //          ],function(err, todos) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.json(todos);
    //         }
    //     });
    // });


    //Vinitha
app.use('/users', users)

process.env.SECRET_KEY = 'secret'

users.route('/').get(function(req, res) {
  console.log(localStorage.getItem('email'))
  User.find(

        {
            email:localStorage.getItem('email'),
            budget:{$gt:0}
    } ,function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
             console.log(localStorage.getItem('email'))
            
        }
    });
});


users.post('/register', (req, res) => {
  const today = new Date();
  var passquery = { email: req.body.email };
  User.find(passquery).then(user => {
      if (user.length>0) {
        res.json({ error: 400 ,msg:'User exists already'})
      } else {
        var user = new User();
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.date = today;
        user.profile = null;
        user.budget = 'not set';
        user.save((err,doc)=>{
        if(!err){
          res.send(doc);
        }
        else{
          console.log("Error in inserting data"+err);
        }
      })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
  
  /*bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(!err){
        user.password = hash
    }else{
      console.log("Error"+err);
    }
  })*/
    
})

users.post('/login', (req, res) => {
  var passquery = { email: req.body.email };
  User.find(passquery)
    .then(user => {
      if (user.length>0) {
        console.log(user[0].email)
        if (req.body.password == user[0].password) {
          // Passwords match
          const payload = {
            _id: user._id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
          localStorage.setItem('email',user[0].email)
        } else {
          // Passwords don't match
          res.json({ error: 400 ,msg:'Email and Password doesnt not match'})
        }
      } else {
        res.json({ error:404,msg: 'User does not exist.Please Register!' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/update',(req,res)=>{
  User.findOneAndUpdate({email: req.body.email},req.body,{new:true},(err,docs)=>{
    if(!err){
      res.send(docs);
    }
    else{
      console.log("Error in updating data"+err);
    }

  });

})

users.get('/profileData',(req,res)=>{
  var remquery = { email: localStorage.getItem('email') };
  User.find((remquery),(err,docs)=>{
    if(!err){
      res.send(docs);
    }
  })
})


//sinthu
app.use('/addReminder',remrouter);
app.use('/expense',router);

remrouter.post('/add',(req,res)=>{
  if(req.body._id==''){
    insertData(req,res);
  }else{
    console.log("works");
    updateData(req,res);
  }
})

function updateData(req,res){
  Reminder.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,docs)=>{
    if(!err){
      res.send(docs);
    }
    else{
      console.log("Error in updating data"+err);
    }

  });
}


function insertData(req,res){
  var rem = new Reminder();
  rem.category = req.body.category;
  rem.amount = req.body.amount;
  rem.date = req.body.date;
  rem.email = localStorage.getItem('email');
  rem.save((err,doc)=>{
    if(!err){
      res.send(doc);
    }
    else{
      console.log("Error in inserting data"+err);
    }
    
  });

}

remrouter.route('/show').get(function(req,res){
  var remquery = { email: localStorage.getItem('email') };
  Reminder.find((remquery),(err,docs)=>{
    if(!err){
      res.send(docs);
    }
  })
})

remrouter.route('/delete/:id').get(function(req,res){
  Reminder.findByIdAndRemove({_id: req.params.id},(err,docs)=>{
    if(!err){
      res.send(docs);
    }
  })
})


router.route('/').get(function(req,res){
  var remquery = { email: localStorage.getItem('email') };
  Expense.find((remquery),(err,docs)=>{
    if(!err){
      console.log(docs)
      pdf.create(pdfTemplate(docs),{}).toFile('C:/Users/Sindhu/Documents/Web Design/Group Assignment/reg/client/src/components/result.pdf',(err)=>{
        if(err){
          console.log("Failed to create PDF");
        }
      })
    }else{
        console.log("Error in retrieving data"+err);
      }
  })
})
//app.listen(port, () => console.log(`Listening on port ${port}`));

//supriya

app.use('/business', businessRoutes);





// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
   var expquery = { email: localStorage.getItem('email') };
    Expense.find((expquery),function(err, businesses){
    if(err){
      console.log(err);
    }
    else {
      console.log(businesses);
      res.json(businesses);
    }
  });
});



businessRoutes.post('/add',(req,res)=>{
  if(req.body._id==''){
    insertExpenseData(req,res);
  }else{
    updateExpenseData(req,res);
  }
})

function updateExpenseData(req,res){
  Expense.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,docs)=>{
    if(!err){
      res.send(docs);
    }
    else{
      console.log("Error in updating data"+err);
    }

  });
}


function insertExpenseData(req,res){
  var expense = new Expense();
  expense.email=localStorage.getItem('email');
  expense.amount = req.body.amount;
  expense.category = req.body.category;
  expense.description = req.body.description;
  expense.date = req.body.date;
  expense.save((err,doc)=>{
    if(!err){
      res.send(doc);
    }
    else{
      console.log("Error in inserting data"+err);
    }
    
  });

}

// Defined delete | remove | destroy route
businessRoutes.route('/delete/:id').get(function (req, res) {
    Expense.findByIdAndRemove({_id: req.params.id}, function(err, business){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = businessRoutes;