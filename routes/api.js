/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var db=require('../db.js');
var Library=db.Library

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //Library.find({},{'__v':0}).exec(function(err,data){
      Library.aggregate([
        {$project:{title:1,commentcount:{$size:"$comments"}}}
      ]).exec(function(err,data){
        res.json(data);
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title){
        res.send("missing title")
      }else{
        var library = new Library({'title':title})
        library.save(function (err,data) {
          if (err) return err;
          console.log('New data saved.');
          //res.json({"title":data["title"],"_id":data["_id"]})
          res.json(data)
          Library.find().sort({"_id":-1}).limit(10).exec(function(err,data){
            var lastID=data[data.length-1]['_id'];
            Library.remove({_id:{$lt:lastID}},function(err,data){
              console.log('Old data removed.');
            });
          });
          });
        }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Library.remove(function (err,data){
        if(err) return;
        res.send('complete delete successful')
      });
    });

  
  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}  
    Library.findById({'_id':bookid},{'__v':0},function (err,data){
        if (err) return;
        if(!data){
          res.send('no book exists');
        }else{
          res.json(data);
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Library.findById({'_id':bookid},function (err,bookToMod){
        if(err) return;
        bookToMod['comments'].push(comment)
        bookToMod.save(function(err,data){
          if(err) return;
          res.json(data)
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Library.findByIdAndRemove({'_id':bookid},function (err,data){
        if(err) return;
        res.send('delete successful')
      });
    });
};
