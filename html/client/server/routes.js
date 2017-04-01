var _ = require('lodash');

var routes = [
    {
        path: '/home',
        httpMethod: 'GET',
        template: 'about',
        middleware: []
    },
    {
        path: '/about-us',
        httpMethod: 'GET',
        template: 'about-us',
        middleware: []
    },
    {
        path: '/parent',
        httpMethod: 'GET',
        template: 'parent',
        middleware: []
    },
    {
        path: '/student',
        httpMethod: 'GET',
        template: 'student',
        middleware: []
    },
    {
        path: '/programme',
        httpMethod: 'GET',
        template: 'programme',
        middleware: []
    },
    {
        path: '/contact',
        httpMethod: 'GET',
        template: 'contact',
        middleware: []
    },
    {
        path: '/privacy',
        httpMethod: 'GET',
        template: 'privacy',
        middleware: []
    },
    {
        path: '*',
        httpMethod: 'GET',
        middleware: [function(req, res, next) {
          res.redirect('/home')
        }]
    }
];

module.exports = function(app) {
  for (var i in routes) {
    applyRoute(app, routes[i]);
  }
}

function applyRoute(app, route) {
  if (route.template) {
    route.middleware.push(function(req, res) {
      res.locals.page = route.template;
      res.render('partials/' + route.template)
    });
  }

  var args = _.flatten([route.path, route.middleware]);
  switch (route.httpMethod.toUpperCase()) {
      case 'GET':
          app.get.apply(app, args);
          break;
      case 'POST':
          app.post.apply(app, args);
          break;
      case 'PUT':
          app.put.apply(app, args);
          break;
      case 'DELETE':
          app.delete.apply(app, args);
          break;
      default:
          throw new Error('Invalid HTTP method specified for route ' + route.path);
          break;
  }
}
