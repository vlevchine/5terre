'use strict';

var React = require('react'),
    router = require('react-router'),
    Link = router.Link;

const App = React.createClass( {
    onLogout() {
        console.log(logout)
    },
    render() {
        return (
            <article>
            <nav className="navbar navbar-fix row" role="navigation">
                <div className="col-sm-6">
                    <h1>Workbench&nbsp;&nbsp;&nbsp;<small><small>Project </small><i>5terre</i></small></h1>
                </div>
                <div className="col-sm-6">
                    <ul className="nav ww-nav pull-right ">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="about">About</Link></li>
                        <li>
                            <a href="#" onClick={this.onClick}>
                                <i className="fa fa-sign-out"></i> Log out
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <hr/>
            <section className="main-content">
                {this.props.children}
            </section>
            <hr/>
            <div className="row">
                <div className="col-sm-12 copyright">&copy; 2016 - Vlad Levchine</div>
            </div>
        </article>
        );
    }
});

module.exports = App;