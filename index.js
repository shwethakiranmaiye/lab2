var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
    //if user is logged -validates the session id and prints hello user
    // else returns invalid session id.
    //If the given session id is wrong returns bad request and asks us to login via http post
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Set-Cookie': "session_id="+sid
            });
			response.end(login.hello(sid));	
		} else {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
        response.writeHead(400, {
                "error": "bad request"});
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	// TODO: read 'name and email from the request.body'
	// var newSessionId = login.login('xxx', 'xxx@gmail.com');
	// TODO: set new session id to the 'session_id' cookie in the response
	// replace "Logged In" response with response.end(login.hello(newSessionId));

    if ('name' in request.body && 'email' in request.body) {
        name = request.body.name
        email = request.body.email
        var newSessionId = login.login(name, email);
        console.log("new session" + newSessionId);
        response.writeHead(200, {
            'Content-Type': 'text/html', 
            'Set-Cookie': "session_id="+newSessionId
        });
	    response.end(login.hello(newSessionId));
    } else {
        response.writeHead(400, {"error": "bad request"});
        response.end("Bad request\n");
    }
};

function del(request, response) {
	console.log("DELETE:: Trying to logout from the server");
    var cookies = request.cookies;
	console.log(cookies);
	if (('session_id' in cookies) ) {
		var sid = cookies['session_id'];
        if (login.logout(sid) === true) {
            console.log("session id" + sid);
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end('Logged out from the server\n');
        }
        else {
            response.writeHead(400, {"Error":"User not loggged out "});
            response.end("Bad request\n"); 
            conlog.log("User not logged out");
        }
    } else {
        response.writeHead(400, {"Error":"Invalid input " });
        response.end("Bad request\n");
    }
};

function put(request, response) {
	console.log("PUT:: Re-generate new seesion_id for the same user");
    var cookies = request.cookies;
    var sid = cookies['session_id'];
    if('session_id' in cookies ){
         if (login.isLoggedIn(sid)) {
            name = request.body.name
            email = request.body.email
            var newSessionId = login.refresh(sid);
            if (newSessionId === null) {
                console.log("Could not refresh session-id");
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Set-Cookie': "session_id="+sid
                });
                response.end("Could not refresh session id\n");
                return;
            }
            console.log("new session" + newSessionId);
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Set-Cookie': "session_id="+newSessionId
            });
           response.end("Re-freshed session id\n");
           return;
        } else {
            console.log("User " + newSessionId + " not logged in.");
            response.writeHead(400, {"error": "User is not logged in"});
            response.end("User not logged in.\n");
        }
    } else {
        console.log("Invalid input.");
        response.writeHead(400, {"error": "bad request"});
        response.end("Invalid user\n");
    }
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
