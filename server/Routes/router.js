const router =require("express").Router();
const passport = require("passport");
const userList=require("../Database/user");
const boardList=require("../Database/board");
const user = require("../Database/user");
require("dotenv").config();

  router.get("/get/:id",async (req,res)=>{
    if(!req.user){
      res.send("Not authorised!")
      return;
    }
    if(req.user.boardId.find((id)=>id===req.params.id)===undefined){
      res.send("N");
      return;
    }
    boardList.findOne({"id":req.params.id},(err, data)=>{
        if (!err) {
          if(!data){
            res.send("N");
            return;
          }
          res.send({cardList:data.boardData,title:data.title});
        } else {
          res.send(err);
        }
      }
    );
  });

  router.get("/get",async (req,res)=>{
    if(!req.user){
      res.send("Not authorised!")
      return;
    }
    userList.findOne({"email":req.user.email},(err, data)=>{
        if (!err) {
          const boardId=(data.boardId);
          boardList.find({"id":{$in:boardId}},(err,data)=>{
            if(err){
              res.send(err);
            }
            if(!err){
              
              const cards=data.map(d=>{
                delete d.boardData;
                return d;
              })
              res.send(cards);
            }
          })
        } else {
          res.send(err);
        }
      });
  });

  router.post("/post/:id",async (req,res)=>{
      if(!req.user){
        res.send("Not authorised!")
        return;
      }
        boardList.updateOne({ "id": req.params.id }, 
          {$set:{"boardData":req.body}},(err,doc)=>{
            if(err)
              res.send(err);
            if(!err)
              res.send("Successfully Updated!");
          }
        );
      
  });

  router.post("/post",async (req,res)=>{
    if(!req.user){
      res.send("Not authorised!")
      return;
    }
    if(req.body.id===null)
    return;
    const boardId=req.body.board.map(b=>{return b.id});
    userList.updateOne({ "email":req.user.email }, 
      {$set:{"boardId":boardId}},(err,doc)=>{
        if(err)
          throw (err);
        if(!err){

        }
      }
    );
    const changedBoard=req.body.board.filter(f=>f.id===req.body.id)
    if(!req.body.deleteFlag){
    boardList.updateOne({ "id": req.body.id }, 
        {$set:changedBoard[0]},{upsert: true, setDefaultsOnInsert: true},(err,doc)=>{
          if(err)
            throw (err);
          if(!err){

          }
        }
    );
    }
    if(req.body.deleteFlag){
      boardList.deleteOne({ "id": req.body.id },(err)=>{
          if(err)
            throw (err);
          if(!err){
            
          }
        }
      );
  }
  });


  router.post("/register", (req,res,next)=>{
    userList.register({"name":req.body.name,"email":req.body.email},req.body.password,(err,usr)=>{
      if(err){
        res.send(err.message);
      }
      if(!err){
        passport.authenticate("local", (err, user, info) => {
          if (err) {res.send("Server Error!"); return;}
          if (!user) res.send("Incorrect Email or Password!");
          else {
            req.logIn(user, (err) => {
              if (err) throw err;
              res.send("Y");
            });
          }
        })(req, res, next);
      }
    })
  })
  
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {res.send("Server Error!"); return;}
      if (!user) res.send("Incorrect Email or Password!");
      else {
        req.logIn(user, (err) => {
          if (err) res.send("Server Error");
          res.send("Y");
        });
      }
    })(req, res, next);
  });

  router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));
  
  router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/authenticate"}),
    (req, res)=> {
      res.redirect(process.env.CLIENT_URL);
  });

  router.get("/authenticate",async (req,res,next)=>{
    if(req.user)
      res.send("Y");
    else{
      res.send("N");
    }
  })
  
  router.get('/logout', (req, res)=>{
    req.session=null;
    req.logout();
    res.redirect(process.env.CLIENT_URL)
  });
  
  module.exports = router;