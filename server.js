const express = require('express')
const db = require('mongoose')
const bodyParser = require('body-parser')

// middleware#
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
// end of middleware#

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(express.static('pages'))

db.connect('mongodbServer/svshop').then(()=>{
    console.log('db is on!!!');  
})


const users = db.Schema({
    username:String,
    email:String,
    pass:String


})

const products = db.Schema({
    product:String,
    price:Number


})

const waitingOrders = db.Schema({
    user:String,
    products:String,
    price:Number


})

const userscollection = db.model('users',users)

const productscollection = db.model('products',products)

const waitingOrdersCollection = db.model('waiting_orders',waitingOrders)



// cookie saving

// sets up the storing variable and the ability to use cookies
let session;
app.use(cookieParser());
// defines how much time the session can exist 24 hours here
const oneDay = 1000 * 60 * 60 * 24;
// makes the session
app.use(sessions({
    // key for the cookie supposed to be random
    secret: "thisismysecrctekeyfhrggfjsuyfgndhy84fwir767",
    // allows the session to be reused if it gets destroyed or times out
    saveUninitialized:true,
    // time to get destroyed
    cookie: { maxAge: oneDay },
    // prevents the session from being used after it was called to prevent overwritting
    resave: false
}));

// end of cookie saving

// login/signup code!!!

app.post('/sendDetail',(req,res)=>{
    let temp = {
        email:req.body.email,
        pass:req.body.pass
    }
    const signIN = async (user) =>{
        let result = await userscollection.findOne({email:user.email})
        if (result == null) {
            res.send('Not Registerd')
        }else{
            let resultOfPass = await userscollection.findOne({email:user.email,pass:user.pass})
            if (resultOfPass == null) {
                res.send('incorrect password or email')
            }else{
                // calls the session
                session=req.session;
                // inserts a new object with the user email
                session.userid=user.email;

                // logout code save for later##
                
                res.send('good')
            }
        }
    }
    signIN(temp)
})

app.post('/signIn',(req,res)=>{
    let temp = {
        username:req.body.username,
        email:req.body.email,
        pass:req.body.pass
    }
    const signUP = async (user) => {
        let result = await userscollection.findOne({email:user.email})
        if (result == null) {
            await userscollection.insertMany(user)
                res.send('good')
        }else{
            res.send('Email taken')
        }
    }
    signUP(temp)
})
// end of login/signup code!!!


// products insert

// const signUP = async (user) => {
//     await productscollection.insertMany(user)
// }
// let arr = [{product:'bread',price:15},{product:'milk',price:23},{product:'gum',price:3}]
// signUP(arr)


app.post('/sendproduct',(req,res)=>{
    let user = req.session.userid
    const check = async (userid) => {
        let result = await userscollection.findOne({email:userid})
        if (result == null) {
            res.send('IMPOSTER')
        }else{
            let all = await productscollection.find({price:{$gt:0}})
            res.send(all)
        }
    }
    check(user)
})


app.post('/saveproduct',(req,res)=>{
    let user = req.session.userid
    let products = ''
    let total = 0
    let price = 0
    

    req.body.forEach((val) => {
        products += ' ' + val.product
        price += val.price
        total++
    });

    let temp = {user:user,products:products,price:price}

    const sendorderinfo = async (te) => {
        await waitingOrdersCollection.insertMany(te)
        res.send({total:total,price:price})
    }
    sendorderinfo(temp)
    
})


app.get('/signUp',(req,res)=>{
    res.sendFile(__dirname + '/pages/signUp.html')
})

app.get('/products',(req,res)=>{
    res.sendFile(__dirname + '/pages/products.html')
})


// res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

const authorizeUsersAccess=((req, res, next)=> {
    if (req.query.admin == 'true') {
        next()  
        } else {
            res.status(400).end('error');
            }
    })

app.get('/all',authorizeUsersAccess,(req,res)=>{
    const send = async()=>{
        let all = await waitingOrdersCollection.find({price:{$gt:0}})
            res.send(all)
    }
    send()
})

app.get('/buy',(req,res) => {
    req.session.destroy();
    res.sendFile(__dirname + '/pages/buy.html')
});






app.listen(3000,()=>{console.log('server work on port 3000');})









// to do list:
// css
// input search