const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const session=require('express-session');
const User=require('./models/model');

const app=express();


mongoose.connect('mongodb://localhost:27017/')
    .then(()=>{
        console.log('Database Connected')
    })
    .catch(err=>{
        console.log(err);
    });

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:true}));
app.use(session({secret:'notagoodsecret'}))
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.render('homepage');
})

app.get('/register',(req,res)=>{
    res.render('register');
});
app.post('/register',async (req,res)=>{
    // res.send(req.body);
    const {password,username}=req.body;
    const hash=await bcrypt.hash(password,12);
    const user= new User({
        username,
        Password:hash
    })
    await user.save();
    req.session.user_id=user._id;
    // res.send(hash);
    res.redirect('/secret');

});
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',async(req,res)=>{
    // res.send(req.body);
    const {username , password}=await req.body;
    const user=await User.findOne({username});
    const validPassword=await bcrypt.compare(password,user.Password);
    if(validPassword){
        req.session.user_id=user._id;
        // res.send('Login Successfull');
        res.redirect('/secret');
    }
    else{
        // res.send('TRY Again');
        res.redirect('/login');
    }
})


app.get('/secret',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    // res.send('You cannnot see me Unless you are logged in');
    res.render('secret');
})

app.post('/logout',(req,res)=>{
    // req.session.user_id=null;
    req.session.destroy();
    res.redirect('/');
})
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});