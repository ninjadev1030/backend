/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CORE
var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
var sizeOf = require('image-size');
var path = require('path');
var formidable = require('formidable');
var mime = require('mime-types');
var easyimg = require('easyimage');

var baseDir = '/public'
var basePath = __dirname + baseDir;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Ecommerce
var stripe = require('stripe')('sk_test_XMnVWwpp2PrHSw8B8LY1XvcK');
// var stripe = require('stripe')('sk_live_qmbUYHirlLA6B7nxeQJYBDD3');
var shippo = require('shippo')('shippo_test_86a4f2851b1b30b9fb7e68a6d9ab1d4c0e70d3a2');


var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');

// for file manager
var isDirectory = function (path) {
  try {
    var dir = fs.statSync(basePath + path);

    return dir && dir.isDirectory();
  } catch (e) {
    return false;
  }
};

// for file manager
var isFile = function (path) {
  try {
    var file = fs.statSync(basePath + path);

    return file && file.isFile();
  } catch (e) {
    return false;
  }
};

    //Create APP
    var app = express();

    //SET CORS
    app.use(cors());
    app.use(bodyParser.json());

    //Static Files
    app.use(express.static('public'));
    // app.use(express.static(basePath));



    var request = require("request");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/noi-beta";
var legacy = "mongodb://13.210.31.113:27017/noisqldev";

//////////////////// List Products //////////////////////////////////////////////////
    app.post('/getProduct', function (req, res) {
                    res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                     console.log(req.body.id);

                    stripe.products.retrieve(
                          req.body.id,
                          function(err, product) {
                            // asynchronously called
                            res.send(JSON.stringify({ result: 'success', data: product }));
                          }
                        );
    });

 //////////////////// List Products //////////////////////////////////////////////////
    app.post('/getProducts', function (req, res) {
                    res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                     console.log(req.body);

                     stripe.products.list(
                          { limit: 100 },
                          function(err, products) {
                              console.log(products);
                            // asynchronously called
                            res.send(JSON.stringify({ result: 'success', data: products }));
                          }
                        );
    });

    app.post('/updateProduct', function (req, res) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Content-Type', 'application/json');

      stripe.products.update(req.body.id, {attributes: {featuredProduct: req.body.featured}});
      return true;
    });


////////////////////////////////////////////////////////////////////////////////
        // Edit Product

                app.post('/products/edit', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        product = req.body.product;
                        var o_id = new mongo.ObjectID(product._id);
                        delete product._id;

                 MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var myquery = {'_id': o_id};
                      var newvalues = product;

                      db.collection("ProductComponent").updateOne(myquery, newvalues, function(err, resp) {
                        if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                            res.send(JSON.stringify({ result: 'success' }));
                        db.close();
                      });


                    });

                });





//////////////////// List Courses //////////////////////////////////////////////////

    app.post('/courses/list', function (req, res) {


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;

                      db.collection("Course").find({
                           "StartDate" : {"$gte": new Date()}

                            }).sort( { StartDate: 1 }).limit(10).toArray(function(err, result) {

                                //Report Results
                                if(result.length){
                                    res.send(JSON.stringify({ result: 'success', data: result }));
                                }else{
                                    res.send(JSON.stringify({ result: 'fail', data: req.body }));
                                }


                                db.close();
                            });
                    });



    });


//////////////////// List Resource //////////////////////////////////////////////////

    app.post('/resources/list', function (req, res) {


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;

                      db.collection("Resource").find().toArray(function(err, result) {

                                //Report Results
                                if(result.length){
                                    res.send(JSON.stringify({ result: 'success', data: result }));
                                }else{
                                    res.send(JSON.stringify({ result: 'fail', data: req.body }));
                                }


                                db.close();
                            });
                    });



    });


//////////////////// List Users //////////////////////////////////////////////////

    app.post('/users/list', function (req, res) {
                          res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                     page = req.body.page;
                     pageSize = req.body.pageSize;

                        console.log(req.body);

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;


                      //Get Count
                      db.collection("UserContact").count(function(err, count) {

                            //Query
                            db.collection("UserContact").find().skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {


                                    res.send(JSON.stringify({ result: 'success', data: result, total: count }));



                                db.close();
                            });
                    });



                      });





    });


    //////////////////// Search Users //////////////////////////////////////////////////

    app.post('/users/search', function (req, res) {
                          res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                     page = req.body.page;
                     pageSize = req.body.pageSize;
                     query = req.body.query;



                        console.log(req.body);

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;


                      //Get Count
                      db.collection("UserContact").find({ $or: [ { FirstName: {'$regex': query} }, { LastName: {'$regex': query} }, { Email: {'$regex': query} } ] }).count(function(err, count) {


                            //Query
                            db.collection("UserContact").find({ $or: [ { FirstName: {'$regex': query} }, { LastName: {'$regex': query} }, { Email: {'$regex': query} } ] }).skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {


                                    res.send(JSON.stringify({ result: 'success', data: result, total: count }));



                                db.close();
                            });
                    });



                      });





    });




 ////////////////////////////////////////////////////////////////////////////////
        // Get USER

                app.post('/users/detail', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        id = req.body.id;

                        var o_id = new mongo.ObjectID(id);


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { id: id };
                      db.collection("UserContact").find({'_id': o_id}).toArray(function(err, result) {

                        //Report Results
                        if(result.length){
                            res.send(JSON.stringify({ result: 'success', data: result }));
                        }else{
                            res.send(JSON.stringify({ result: 'fail', data: req.body }));
                        }


                        db.close();
                      });
                    });

                });


 ////////////////////////////////////////////////////////////////////////////////
        // Edit USER

                app.post('/users/edit', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        user = req.body.user;
                        var o_id = new mongo.ObjectID(user._id);
                        delete user._id;

                 MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var myquery = {'_id': o_id};
                      var newvalues = user;

                      db.collection("UserContact").updateOne(myquery, newvalues, function(err, resp) {
                        if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                            res.send(JSON.stringify({ result: 'success' }));
                        db.close();
                      });


                    });

                });




     ////////////////////////////////////////////////////////////////////////////////
        // Create USER
            app.post('/users/create', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                       console.log(req.body.user);

                       MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("UserContact").insertOne(req.body.user, function(err, resp) {
                            if (err) res.send(JSON.stringify({ result: 'fail', message: err }));
                            res.send(JSON.stringify({ result: 'success', data: req.body }));
                            db.close();
                          });
                        });
                });



//////////////////// Search //////////////////////////////////////////////////
app.post('/search', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

        page = req.body.page;
        pageSize = req.body.pageSize;
        query = req.body.query;
            if(query._id) query._id = new mongo.ObjectID(query._id);
        table = req.body.table;

        sort = {};
        if(req.body.sort) sort = req.body.sort;
        console.log(req.body);
        //Check Database
        MongoClient.connect(legacy, function(err, db) {
            if (err) throw err;
            //Get Count
            db.collection(table).find(query).count(function(err, count) {
                //Query
                db.collection(table).find(query).sort(sort).skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {
                    return res.send(JSON.stringify({ result: 'success', data: result, total: count }));
                    db.close();
                });
            });
        });
});

////////////////////////////////////////////////////////////////////////////////
// FileUpload
    app.post('/upload', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log('running upload!');


             var formidable = require('formidable');
             var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {

                   console.log(files.file);

                    var oldpath = files.file.path;
                    var newpath = '/var/www/html/uploads/' + files.file.name;

                      fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                         res.send(JSON.stringify({ result: 'success', data: files.file.name}));

                      });




                });

            //


    });




////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/save', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);

               query = {};
               table = req.body.table;
               obj = req.body.obj;
                if(obj._id) {
                    o_id = new mongo.ObjectID(obj._id);
                    delete obj._id;
                }else{
                    o_id = new mongo.ObjectID();
                }

                query = {'_id': o_id};

                console.log(query);

               MongoClient.connect(legacy, function(err, db) {
                  if (err) throw err;

                  db.collection(table).updateOne(query, obj, {upsert: true}, function(err, resp) {
                    if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                        res.send(JSON.stringify({ result: 'success', data: resp }));
                    db.close();
                  });
                });
        });


        ////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/dropComment', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);



                //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { Email: req.body.user.email, Password: req.body.user.password };
                      db.collection("UserContact").find(query).toArray(function(err, result) {

                        //Report Results
                        if(result.length){
                            user = result[0];

                        }else{
                           user = {
                               FirstName: 'Anonymous'
                           }
                        }

                        var isodate = new Date().toISOString()
                        comment = {
                            comment_author: user.FirstName + ' ' + user.LastName,
                            comment_date: isodate,
                            comment_content: req.body.reply
                        }







                        db.collection("posts").update(
                            { "slug":  req.body.id },
                            { "$push": {"comments": comment } },
                            function(err, res) {

                                console.log(res);

                            });






                        return res.send(JSON.stringify({ result: 'success', user: user }));

                             db.close();
                      });
                    });





        });


       function getUserDetails(user){



       }


   ////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/delete', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);


               table = req.body.table;
               id = req.body.id;
               o_id = new mongo.ObjectID(id);

               MongoClient.connect(legacy, function(err, db) {
                  if (err) throw err;

                 db.collection(table).deleteOne({ '_id': o_id }, function(err, results) {
                     if (err) return res.send(JSON.stringify({ result: 'fail', data: err }));
                     return res.send(JSON.stringify({ result: 'success', data: results }));
                 });


                });
        });





        ////////////////////////////////////////////////////////////////////////////////
        // Login USER

                app.post('/login', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        email = req.body.email;
                        password = req.body.password;

                        if(!email || !password){
                             res.send(JSON.stringify({ result: 'fail', data: 'No Data' }));
                              return false;
                             }


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { Email: email, Password: password };
                      db.collection("UserContact").find(query).toArray(function(err, result) {

                        //Report Results
                        if(result.length){

                            response = {
                                email: email,
                                password: password,
                                IsStaff: result[0].IsStaff,
                                IsCourseHost: result[0].IsCourseHost,
                                IsFaculty: result[0].IsFaculty
                            }

                            res.send(JSON.stringify({ result: 'success', data: result[0] }));
                        }else{
                            res.send(JSON.stringify({ result: 'fail', data: req.body }));
                        }


                        db.close();
                      });
                    });

                });



     ////////////////////////////////////////////////////////////////////////////////
        // Order

                app.post('/order', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');




                     //Create New Order
                        stripe.orders.create({
                          currency: 'aud',
                          items: req.body.cart,
                          shipping: {
                            name: req.body.shipping.recipient,
                            address: {
                              line1: req.body.shipping.line1,
                              city: req.body.shipping.city,
                              state: req.body.shipping.state,
                              country: req.body.shipping.country,
                              postal_code: req.body.shipping.postalCode
                            }
                          },
                          email: req.body.user.email
                        }, function(err, order) {
                             if(err) return res.send(JSON.stringify({ fail: true, error: err.message }));
                             var order_id = order.id;
                             if(req.body.charge){
                                 //Create Charge Token
                                 stripe.tokens.create({
                                      card: {
                                        "number": req.body.payment.cc,
                                        "exp_month": req.body.payment.expMonth,
                                        "exp_year": req.body.payment.expYear,
                                        "cvc": req.body.payment.cvc
                                      }
                                    }, function(err, token) {
                                        if(err)return res.send(JSON.stringify({ fail: true, error: err.message }));
                                        var token_id = token.id;

                                        //Charge
                                           stripe.orders.pay(order_id, {
                                              source: token_id // obtained with Stripe.js
                                            }, function(err, order) {
                                               if(err)return res.send(JSON.stringify({ fail: true, error: err.message }));
                                               allocateDownloads(req.body.order);
                                               return res.send(JSON.stringify({ success: true, data: order }));
                                            });
                                 });
                            }else{
                                 //Return Totals
                                  return res.send(JSON.stringify({ success: true, data: order }));
                             }
                        });
               });

            app.post('/shippment', function (req, res) {
                var addressFrom  = {
                    "name": req.body.sender.name,
                    "street1": req.body.sender.street,
                    "city": req.body.sender.city,
                    "state": req.body.sender.state,
                    "zip": req.body.sender.zip,
                    "country": req.body.sender.country,
                    "phone": req.body.sender.phone,
                    "email": req.body.sender.email
                };

                var addressTo = {
                    "name": req.body.reciever.name,
                    "street1": req.body.reciever.street,
                    "city": req.body.reciever.city,
                    "state": req.body.reciever.state,
                    "zip": req.body.reciever.zip,
                    "country": req.body.reciever.country,
                    "phone": req.body.reciever.phone,
                    "email": req.body.reciever.email
                };

                var parcel = {
                    "length": parcel.length,
                    "width": parcel.width,
                    "height": parcel.width,
                    "distance_unit": parcel.distance_unit,
                    "weight": parcel.weight,
                    "mass_unit": parcel.mass_unit
                };

                shippo.shipment.create({
                    "address_from": addressFrom,
                    "address_to": addressTo,
                    "parcels": [parcel],
                    "async": false
                }, function(err, shipment){
                    // asynchronously called
                    if(err) return res.send(JSON.stringify({ fail: true, error: err.message }));
                    return res.send(JSON.stringify({ success: true, data: shippment }));
                });
            })


             function allocateDownloads(order){
                 for (var i = 0, len = order.cart.length; i < len; i++) {
                        if(order.cart[i].download) createDownload(order.user, order.cart[i].download);
                 }

             }

             function createDownload(user, download){
                        var download = {
                            user: user,
                            download: download
                        }

                        MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("downloads").insertOne(download, function(err, resp) {
                            if (err){
                                 console.log(err);
                                 }else{
                                     console.log('Download Created!');
                                 }

                            db.close();
                          });
                        });

             }


        ////////////////////////////////////////////////////////////////////////////////
        // Download

                app.get('/download/:id', function (req, res) {
                    var id = req.params.id;
                    var o_id = new mongo.ObjectID(id);

                    var filename = null;

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { id: id };
                      db.collection("downloads").find({'_id': o_id}).toArray(function(err, result) {
                        console.log(result[0].download);
                            filename = result[0].download;
                            var file = '/var/www/html/uploads/' + filename;
                            res.download(file); // Set disposition and send it.

                        db.close();
                      });
                    });


                });



        ////////////////////////////////////////////////////////////////////////////////
        // SignUP USER

                app.post('/signup', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                       console.log(req.body.signup);
                       let q = { Email: req.body.signup.email, Password: req.body.signup.password}
                       MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("UserContact").insertOne(q, function(err, resp) {
                            if (err) res.send(JSON.stringify({ result: 'fail', message: err }));
                            res.send(JSON.stringify({ result: 'success', data: req.body }));
                            db.close();
                          });
                        });
                });

                // file manager
                app.get('/api/folder', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var paths = [];
                  var subNode = req.query.nodeId || '';
                  var items = fs.readdirSync(basePath + subNode);
                  for (var i = 0; i < items.length; i++) {
                    var name = items[i];
                    var stat = fs.statSync(basePath + subNode + '/' + name);
                    if (stat && stat.isDirectory()) {
                      var dir = {
                        id: subNode + '/' + name,
                        parentId: subNode || null,
                        name: name,
                        children: []
                      };

                      paths.push(dir);
                    }
                  }

                  res.json(paths);

                });

                app.put('/api/folder', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var node = req.body;

                  if (isDirectory(node.id)) {
                    var subNodes = node.id.split('/');
                    subNodes[subNodes.length - 1] = node.name;
                    var newNodeName = subNodes.join('/');

                    if (isDirectory(newNodeName)) {
                      res.sendStatus(403);
                      res.json({msg: 'Directory already exists'});
                    }
                    else {
                      fs.renameSync(basePath + node.id, basePath + newNodeName);

                      if (isDirectory(newNodeName)) {
                        node.id = newNodeName;
                        res.json(node);
                      } else {
                        res.sendStatus(403);
                        res.json({msg: 'Could not change node name'});
                      }
                    }

                  } else {
                    res.sendStatus(403);
                    res.json({msg: 'Node does not exist'});
                  }
                });

                app.put('/api/folder/move', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var data = req.body;

                  if (data.target === null) {
                    data.target = '';
                  }

                  if (isDirectory(data.source) && isDirectory(data.target)) {
                    var subNodes = data.source.split('/');
                    var dirName = subNodes[subNodes.length - 1];
                    var newNodeName = data.target + '/' + dirName;

                    fs.renameSync(basePath + data.source, basePath + newNodeName);
                    var dir = {
                      id: newNodeName,
                      name: dirName,
                      parentId: data.target,
                      children: []
                    };

                    res.json(dir);
                  } else {
                    res.sendStatus(403);
                    res.json({msg: 'Node does not exist'});
                  }

                });

                app.post('/api/folder', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var data = req.body;
                  var node = data.node;
                  var parentFolderId = data.parentNodeId || '';
                  var newNodeId = parentFolderId + '/' + node.name;

                  if (!isDirectory(newNodeId)) {
                    fs.mkdirSync(basePath + newNodeId);

                    if (isDirectory(newNodeId)) {
                      res.json({
                        id: newNodeId,
                        name: node.name,
                        parentId: parentFolderId || null,
                        children: []
                      });
                    } else {
                      res.sendStatus(403);
                      res.json({msg: 'Node has not been added'});
                    }

                  } else {
                    res.sendStatus(403);
                    res.json({msg: 'Node exists'});
                  }
                });


                app.delete('/api/folder', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var data = req.body;
                  var nodeId = data.nodeId || null;

                  if (isDirectory(nodeId)) {
                    fs.rmdirSync(basePath + nodeId);
                    res.json({
                      success: !isDirectory(nodeId)
                    });
                  } else {
                    res.sendStatus(403);
                    res.json({msg: 'Directory exists'});
                  }
                });


                function prepareFile(filePath) {
                  var src = filePath;
                  var mimeType = mime.lookup(filePath);
                  var isImage = false;
                  var dimensions;
                  var name = filePath.split('/').pop();

                  if (mimeType) {
                    isImage = mimeType.indexOf('image') === 0;
                  }

                  if (isImage) {
                    dimensions = sizeOf(path.join(basePath, filePath))
                  }

                  return {
                    id: filePath,
                    name: name,
                    thumbnailUrl: 'http://localhost:8080' + src,
                    url: 'http://localhost:8080' + src,
                    type: mimeType,
                    width: isImage ? dimensions.width : 0,
                    height: isImage ? dimensions.height : 0
                  };
                }
                app.get('/api/files', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var files = [];
                  var subdir = req.query.dirId || '';
                  var items = fs.readdirSync(basePath + subdir);

                  for (var i = 0; i < items.length; i++) {
                    var name = items[i];
                    var stat = fs.statSync(basePath + subdir + '/' + name);
                    if (stat && stat.isFile()) {
                      var path2 = path.join(subdir, name);

                      files.push(prepareFile(path2));
                    }
                  }

                  res.json(files);

                });


                app.post('/api/files', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var fileExist = false;
                  var newPath;
                  var form = new formidable.IncomingForm();

                  form.multiples = true;

                  form.uploadDir = basePath;

                  form.on('file', function (field, file) {
                    var folder = req.header('folderId');

                    file.name = file.name.replace(/[^A-Za-z0-9\-\._]/g, '');

                    if (folder) {
                      newPath = path.join(folder, file.name);
                    } else {
                      newPath = file.name;
                    }

                    if (isFile(newPath)) {
                      fileExist = true;
                      fs.unlinkSync(file.path);
                    } else {
                      fs.renameSync(file.path, basePath + newPath);
                    }
                  });

                  form.on('error', function (err) {
                    console.log('An error has occured: \n' + err);
                  });

                  form.on('end', function () {
                    if (fileExist) {
                      res.statusCode = 409;
                      res.end('error');
                    } else {
                      res.json(prepareFile(newPath));
                    }
                  });

                  form.parse(req);
                });


                app.put('/api/files', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var body = req.body;
                  var fileId = body.id || null;
                  var bounds = body.bounds || null;


                  if (isFile(fileId)) {
                    if (bounds) {
                      var src = path.join(basePath, fileId);
                      easyimg.crop({
                        src: src,
                        dst: src,
                        cropwidth: bounds.width,
                        cropheight: bounds.height,
                        x: bounds.x,
                        y: bounds.y,
                        gravity: 'NorthWest'
                      });
                    }
                    res.json(prepareFile(fileId));
                  } else {
                    res.status(403);
                    res.json({msg: 'File does not exist'});
                  }
                });

                app.delete('/api/files', function (req, res) {
                  res.header('Access-Control-Allow-Origin', '*');
                  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                  res.header('Access-Control-Allow-Headers', 'Content-Type');
                  res.setHeader('Content-Type', 'application/json');
                  var fileId = req.query.id || null;

                  if (isFile(fileId)) {
                    fs.unlinkSync(path.join(basePath, fileId));
                    res.json({
                      success: true
                    });
                  } else {
                    res.status(403);
                    res.json({msg: 'File does not exist'});
                  }
                });



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// //SETUP SERVER     ////////////////////////////////////////////////////////////////////////////////
           var server = app.listen(8080, function () {
           var host = server.address().address
           var port = server.address().port

           console.log("Example app listening at http://%s:%s", host, port)
        })
