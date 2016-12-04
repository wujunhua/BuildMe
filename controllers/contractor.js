const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var contractor = require('../controllers/contractor');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
const client = new pg.Client(connectionString);
client.connect();


router.route('/contractor')

router.get('/dashboard', function(req, res) {
  if(!req.session.user)
    return res.status(401).send();
  return res.render('contractor/dashboard', {title: "Contractor's dashboard", session:req.session})
});



/* get open bids of these contractor
*/
router.get('/openbids', function(req,res){

   if(!req.session.user)
      return res.redirect('/login');

  var results = [];
  // Grab data from http request
  // Get a Postgres client from the connection pool
  var queryString = 'SELECT "bids"."id", "jobID", "estCost", "estTime", "startDays","comment", "bids"."updatedAt" AS "bidUpdatedAt",'
                  + '"bidID", "street", "city", "state", "jobs"."zipcode", "jobDesc", "jobs"."updatedAt" AS "jobUpdatedAt", "bidID",'
                  + '"firstName", "lastName"'
                  + 'FROM "job_bids" AS "bids"'
                  + 'JOIN "homeowner_jobs" AS "jobs"'
                  + 'ON "bids"."jobID" = "jobs"."id"'
                  + ' JOIN "homeowners" on "homeowners"."id" = "jobs"."hoID"'
                  + 'WHERE "coID" = '+ req.session.user.id
                  // + 'AND "bidID" IS NOT null '
                  + 'ORDER BY "jobUpdatedAt" DESC, "bidUpdatedAt" DESC';

  query = client.query(queryString);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {
      // return res.json(results);
      if(results.length == 0)
         return res.render('contractor/openbids', {title: "Open Bids", session:req.session});

      return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: results});
  });

  

  //find bids;
    // models.job_bids.findAll({
    //  where: {
    //  coID: req.session.user.id,
    //  },
    //  order: '"createdAt" DESC',
    // })
    // .then(function(bids){

       // return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: results});

    // });

  // return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: GetConBids(req.session.user.id) });

});




router.get('/wonbids', function(req,res){

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('contractor/wonbids', {title: "Won Bids", session:req.session});
});

router.get('/ongoingjobs', function(req,res){

    if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/ongoingjobs', {title: "Ongoing jobs", session:req.session});
});

router.get('/completedjobs', function(req,res){

  if(!req.session.user)
     return res.redirect('/login');
  return res.render('contractor/completedjobs', {title: "Completed Jobs", session:req.session});
});

router.get('/overview', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/overview', {title: "Overview", session:req.session});
});

router.get('/message', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/message', {title: "Message", session:req.session});
});

router.get('/profile',function(req,res){

  if(!req.session.user)
     return res.redirect('/login');

 models.contractors.findOne({
      where: {
         id: req.session.user.id,
     }
  }).then(function(user){
    
    res.render('contractor/profile', {title:"profile", user:user, session:req.session});
  });
});



//update profile
router.post('/profile',function(req,res){

  if(!req.session.user)
     return res.redirect('/login');

  models.contractors.findOne({
      where: {
         id: req.session.user.id,
     }
  }).then(function(user){
      if(user){
          user.updateAttributes({
            firstName :    req.body.Fname,
            lastName :     req.body.Lname,
            email :        req.body.email,
            companyName :  req.body.companyName,
            phoneNumber:   req.body.phoneNumber,
            licenseNumber: req.body.licenseNumber
            
          })
          .then(function(user){

            req.session.user = user;
            res.render('contractor/profile', {title:"profile", session:req.session});
          });
      }
    });

});



module.exports = router;