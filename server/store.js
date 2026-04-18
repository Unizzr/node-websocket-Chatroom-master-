const db=require("./db");
const util=require("./utils")
const fs=require('fs')

const RECALL_TIME_LIMIT = 5 * 60 * 1000;

module.exports ={
  saveUser(user,status){
    console.log(user.name,status);
    if(status==='login'){
      return new Promise((resolve, reject) => {
        db.user.insert(user,(err,newUser) => {
          if(err){
            reject(err)
          }else {
            resolve(newUser)
          }
        })
      })
    }
  },
  saveMessage(from,to,message,type){
    if(type==='image'){
      const base64Data = message.replace(/^data:image\/\w+;base64,/, "")
      const dataBuffer = new Buffer.from(base64Data,'base64')
      const filename = util.MD5(base64Data)
      fs.writeFileSync(`./upload/${filename}.png`,dataBuffer)
      message=`/assets/images/${filename}.png`
    }
    console.log("\033[36m"+from.name+"\033[0m对<\033[36m"+to.name+"\033[0m>:\033[32m"+message+"\033[0m")
    const doc={
      from,
      to,
      content:message,
      type,
      time:new Date().getTime(),
      isRecalled:false
    }
    return new Promise((resolve, reject) => {
      db.message.insert(doc,(err,newDoc) => {
        if(err){
          reject(err)
        }else {
          resolve(newDoc)
        }
      })
    })
  },
  getMessages() {
    return new Promise((resolve, reject) => {
      db.message.find({}).sort({time:1}).skip(0).limit(100).exec((err,docs) => {
        if(err){
          reject(err)
        }else {
          resolve(docs)
        }
      })
    })
  },
  getMessageById(messageId) {
    return new Promise((resolve, reject) => {
      db.message.findOne({_id: messageId}, (err, doc) => {
        if(err){
          reject(err)
        }else {
          resolve(doc)
        }
      })
    })
  },
  canRecallMessage(message, userId) {
    if (!message) return false;
    if (message.isRecalled) return false;
    if (message.from.id !== userId) return false;
    const now = new Date().getTime();
    const timeDiff = now - message.time;
    return timeDiff <= RECALL_TIME_LIMIT;
  },
  recallMessage(messageId) {
    return new Promise((resolve, reject) => {
      db.message.update(
        {_id: messageId},
        {$set: {isRecalled: true, recallTime: new Date().getTime()}},
        {},
        (err, numReplaced) => {
          if(err){
            reject(err)
          }else {
            resolve(numReplaced > 0)
          }
        }
      )
    })
  },
  getUsers(){
    return new Promise((resolve, reject) => {
      db.user.find({}).sort({time:1}).skip(0).limit(100).exec((err,docs) => {
        if(err){
          reject(err)
        }else {
          resolve(docs)
        }
      })
    })
  }
};
