const express = require('express');   
    //const path = require('path');
    //const path = require('path');
const path = require('path');
const app = express();
//const app = express();


const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');


// only to be usage 

 const session = require('express-session');     
  const passport = require('passport');      
   const passportLocal = require('./config/passport-local-strategy');      
    const MongoStore = require('connect-mongo');       
     const User = require('./models/user');       
      const cookieParser = require('cookie-parser' );      

 
app.use(express.urlencoded());
//app.use(express.urlencoded());
//app.use(express.urlencoded());
app.use(cookieParser());
//app.use(cookieParser());
 

app.use(expressLayouts);
//   ..  script given to layout
 app.set('layout extractStyles', true);
 
 app.set('layout extractScripts', true);
 // app.use(express.static(apath.join(___dirname, '//static')));
   app.use(express.static(path.join(__dirname, '/static')));

// view the engine

  app.set('view engine', 'ejs');  
  //to be viewed
app.set('views', './views');
//          storing thinigs
//  store the session mongoose
// only storing
app.use(session({
     name: 'chat app session' , 
     secret: 'blahsomething' , 
     saveUninitialized:false ,
      resave:    false , 
     cookie :{
   maxAge : ( 1000 *60  *100 ) 
    } ,
     store: MongoStore.create(
         {  
     mongoUrl: 'mongodb://localhost/chat_app_db'   
//mogo23
      }  ,
    function(err){
        console.log(err || 'connect-mongodb setup ok');
          }
        )  
//        console.log(err || 'connect-mongodb setup ok');

    }));   
//        console.log(err || 'connect-mongodb setup ok');
 app.use(passport.initialize());   
//app.use(passport.initialize());
 app.use(passport.session())  
  app.use(passport.setAuthenticatedUser);  
 


    app.get('/', (req, res) => {
       if(req.isAuthenticated())  {  
           return res.render('chat');
      }
      
      
      return res.render('user_sign_in.ejs');
})
 app.get('/signin', (req, res) =>   {  
      if(req.isAuthenticated())  {
          return res.redirect('/');  
      }
      return res.render('user_sign_in.ejs');
}) 
//'//''//
app.get('/signup', (req, res) => {  
    if (req.isAuthenticated()) {  
        return res.redirect('/');  
    }
//sdf
     return res.render('user_sign_up.ejs'); 
  
    })

  app.post('/create-user', (req, res) => {
      if (req.body.password != req.body.confirm_password) {
          console.log('password is not matching ')
          return res.redirect("back");
      } //rendering
      User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
              return console.log('Error on finding user on database');
         } //new things
        if(!user)  {
            User.create(req.body, (err, data) => {
                if (err )  {  
                console.log('Error in creating the new contact!! Sorry', err); 
                     return res.redirect("back");  
                } 
                //new 
                console.log('Successfully Created a New User!!');
                return res.redirect('/signin');
            }) //df
        
        }   
         else  {
             console.log('User is already have an account');
                return res.redirect("back");
        }
    })
})

app.post('/create-session', passport.authenticate(
    'local',   
     //passport to use local
   


    { failureRedirect: '/signin' }
    //  failed then go to  signin  page ok
 ), (req, res) =>  {  
     return res.redirect('/');
})

  app.get('/signout', (req, res) => {
      req.logout();
       return res.redirect('/signin');  //sd
});
//sdfd
const  server = app.listen(PORT, (err) => {
    if  (err) {  
        console.log(`Error in running the server: ${err}`);  
    }  
      console.log(`Server is running up and running on ${PORT} port`);
});  


const io = require('socket.io')(server);
const users = {};//ok upto now
//ok
io.on('connection',  (socket) => {  
    console.log('connected');
    socket.on('new-user-joined',  (name)  => {    
          users[socket.id] = name;     
          socket.broadcast.emit('user-joined', name)
       });   
//Seek 
    socket.on('send-message', message    =>    {   
        console.log(users);   
           socket.broadcast.emit('recieve', {    
                message,
               name: users[socket.id]   
             })
       }); 
    //ok 
      socket.on('leave', () => {     
            console.log("name");   
            socket.broadcast.emit('user-leave', {  
               name: users[socket.id],    
           })   
    })  
  
})
    