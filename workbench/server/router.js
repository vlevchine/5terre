var express = require('express');

function setCors(app) {
  app.use(function(req, res, next) {//allow cors
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Security-Policy', "default-src 'self'");
    next();
  });
}

function setRoutes(app) {
  var router = express.Router();
  setCors(app);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Workbench' });
  });

  app.use('/', router);
}

module.exports = {
  setRoutes: setRoutes
};
