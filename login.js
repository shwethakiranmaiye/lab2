
/**
 * Login Class
 */
function Login() {
	// sessionId -> user map
	this.sessionMap = {
		99999 : { name: 'Foo', email: 'foo@bar.com' }
	};
}
/**
 * Say Hello {name} to the user
 */
Login.prototype.hello = function(sessionId) {
	return 'Hello ' + this.sessionMap[sessionId].name + '\n';
};

/**
 * Check whether the given session id is valid (is in sessionMap) or not.
 */
Login.prototype.isLoggedIn = function(sessionId) {
	return sessionId in this.sessionMap;
};

/**
 * Create a new session id for the given user.
 */
Login.prototype.login = function(_name, _email) {
   /*
	* Generate unique session id and set it into sessionMap like foo@bar.com
	*/
	var sessionId = new Date().getTime();
	this.sessionMap[sessionId] = { name: _name, email: _email } 
	
	console.log('new session id ' + sessionId + ' for login::' + _email);
	
	return sessionId;
};

/**refresh session id */
Login.prototype.refresh = function(sid) {
   /*
    * Generate unique session id and set it into sessionMap like foo@bar.com
    */
    if(sid in this.sessionMap){
        var my_value = this.sessionMap[sid];
        delete this.sessionMap[sid]; 
        var sessionId = new Date().getTime();
        this.sessionMap[sessionId] = my_value;
        console.log('new session id ' + sessionId );
        return sessionId;
    }else{
        return null;
    }
};

/**
 * Logout from the server
 */ 
Login.prototype.logout = function(sessionId) {
    if(sessionId in this.sessionMap){
        delete this.sessionMap[sessionId];
        console.log('logout::' + sessionId);
        return true;
    }
    return false;
};

// Export the Login class
module.exports = new Login();
