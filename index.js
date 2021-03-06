const express = require('express');
const dataService = require('./services/data.service');

const session = require('express-session');

const app = express();

app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}));

app.use(express.json());

const logMiddleware = (req,res,next) => {
    console.log(req.body);
    next();
}

//app.use(logMiddleware);

const authMiddleware = (req,res,next) => {
    if(!req.session.currentUser){
        return res.status(401).json({
            status:false,
            statusCode:401,
            message:'Please Login'
        });
    }else{
        next();
    }
};



app.get('/',(req,res)=>{
    res.status(200).send("Hello World");
})
app.post('/',(req,res)=>{
    res.send("post method");
})
app.post('/register',(req,res)=>{
    dataService.register(req.body.name,req.body.acno,req.body.pin,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    //res.status(200).send("sucess");
    //res.status(result.statusCode).json(result);
})
app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno1,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
   })
 app.post('/deposit',authMiddleware, (req,res)=>{
    const  result = dataService.deposit(req.body.dpacno,req.body.dppin,req.body.dpamt)
    res.status(result.statusCode).json(result);
   })
app.post('/withdraw',authMiddleware,(req,res)=>{
    const  result = dataService.withdraw(req.body.wacno,req.body.wpin,req.body.wamt)
    res.status(result.statusCode).json(result);
   })
 app.get('/transactions',authMiddleware,(req,res)=>{
    const  result = dataService.getTransactions(req)
    res.status(200).json(result);
   })
   app.delete('/transactions/:id',authMiddleware,(req,res)=>{
    const result = dataService.deleteTransaction(req,req.params.id)
    res.status(200).json(result);
   })
//    app.get('/transactions',authMiddleware,(req,res)=>{
//     const  result = dataService.getTransactions()
//     res.status(200).json(result);
//    })


app.put('/',(req,res)=>{
    res.send("put method");
})
app.patch('/',(req,res)=>{
    res.send("patch method");
})
app.delete('/',(req,res)=>{
    res.send("delete method");
})


const port = 3000;
app.listen(port ,()=>{
    console.log("server started at port " +port);
})

