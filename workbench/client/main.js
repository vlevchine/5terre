/**
 * Created by valev on 2016-02-12.
 */
const React = require('react'),
    DOM = require('react-dom'),
    router = require('react-router'),
    Router = router.Router,
    Route = router.Route;
//    IndexRoute  = router.IndexRoute,
//    history = router.browserHistory,
//    App = require('./app'),
//    About = require('./pages/about'),
//    Index = require('./pages/index'),
//    auth = require('./auth'),
//    actions = require('./actions/appActions'),
//    authStore = require('./stores/authStore');
//
//authStore.init(window.location.hash.replace('#', ''));
//
//DOM.render((
//    <Router history={history}>
//        <Route path="/" component={App}>
//            <IndexRoute component={Index} />
//            <Route path="about" component={About} />
//        </Route>
//    </Router>
//), document.getElementById('main'));

//auth.setTokens(window.location.hash.substr(1));
//window.location.hash = '';
//var rt = auth.getIdToken();
//
//var loginURL = 'http://localhost:3080/api/login'
//var auth = {
//    login: function(email, password) {
//        return axios
//            .post(loginURL, { email: email, password: password })
//            .then(function (response) {
//                authToken.setToken(response);
//            })
//            .catch(function (err) {
//                console.log(err);
//            });
//    },
//    logout: function() {
//        authToken.removeToken();
//    },
//    sendRequest: function(url, data) {
//        var token = authToken.getToken();
//
//        if (!token) { return Promise.reject('No token available for accessing protected resources'); }
//
//        return axios.get(url, data, { transformRequest: [
//            function (data, headers) {
//                headers.common['Authorization'] ='Bearer ' + token;
//                return data;
//            }]
//        });
//    }
//};
//
//var rt = document.getElementById('app').addEventListener('click', function() {
//    var token = authToken.getToken(),
//        headers = token ? {headers: {'Authorization': 'Bearer ' + token}} : {};
//    axios.post('http://localhost:3080/api/login', {
//        firstName: 'Fred',
//        lastName: 'Flintstone'
//    }, {  transformRequest: [function (data, headers) {
//        // Do whatever you want to transform the data
//headers.common['Authorization'] ='Bearer ' + '123';
//        return data;
//    }]
//    });
//})


