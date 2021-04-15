function kvHeaders(headers, parent) {
    var kvpairs = "";
    for (var h in headers) {
        kvpairs += " " + parent + "." + h + "=";
        if ( headers[h].indexOf(" ") == -1 ) {
        kvpairs += headers[h];
        } else {
            kvpairs += "'" + headers[h] + "'";
        }
    }
    return kvpairs;
}

function kvHeadersDict(headers) {
    var kvpairs = {};
    for (var h in headers) {
	kvpairs[h] = headers[h];
    }
    return kvpairs;
}
function kvHeadersTxt(r) {
   var kvpairs = "";
    for (var h in r.headersIn) {
	kvpairs += h + "=" + r.headersIn[h] + "\n";
    }
    return kvpairs;
}

function backend(r) {
    var startTime = Date.now()
    r.headersOut['Content-Type'] = 'text/plain';
    r.subrequest('/backend/')
	.then(res => {
	    var elapseTime = Date.now() - startTime;
	    var output = res.responseBody.replace("upstream_response_time",elapseTime);
	    r.return(200, output);
	})
    .catch(e => r.return(501, e.message))
}
function ping(r) {
    var startTime = Date.now();
    ngx.fetch(process.env['F5DEMO_PONG_URL'],{"headers":{"user-agent":"F5 Demo Ping/1.0"}})
	.then(reply => reply.text())
	.then(body => {
	    var output = JSON.parse(body);
	    output['response_time'] = Date.now() - startTime;
	    r.headersOut['Content-Type'] = 'application/json';        	    
	    r.return(200, JSON.stringify(output) + '\n');
	}
	)
	.catch(e => {
	    var output = {'error':e.message};
	    r.headersOut['Content-Type'] = 'application/json';        	    	    
	    r.return(501, JSON.stringify(output)) + '\n';
		    })
}
function pong(r) {
    r.headersOut['Content-Type'] = 'application/json';
    var output = {"name":r.variables.f5demo_nodename};
    if (r.variables.request_uri === "/pong/extended") {
	var upper_scheme = r.variables.scheme.toUpperCase();
	if( r.variables.http2 ) {
	    upper_scheme = 'HTTP2';
	}
	
	output['short_name'] = r.variables.hostname;
        output['server_addr'] = r.variables.server_addr;
        output['server_port'] = r.variables.server_port;
        output['remote_addr'] = r.remoteAddress;
        output['remote_port'] = r.variables.remote_port;
        output['protocol'] = upper_scheme;
	output['request_method'] = r.variables.request_method;
	output['request_uri'] = r.variables.request_uri;
	output['host_header'] = r.variables.host;
	output['user_agent'] = r.variables.http_user_agent;
	if ( r.variables.http_X_Forwarded_for ) {
	    output['x-forwarded-for'] =  r.variables.http_X_Forwarded_for;
	}
	

    }
    r.return(200,JSON.stringify(output));
}

function headers_json(r) {
    r.headersOut['Content-Type'] = 'application/json';    
    r.return(200, JSON.stringify(kvHeadersDict(r.headersIn)) + '\n');
}
function f5demo_txt(r) {
    var output = "";
    if (process.env['F5DEMO_BRAND'] === "volterra") {
	output = "==========================================================================\n /$$    /$$          /$$   /$$\n| $$   | $$         | $$  | $$\n| $$   | $$ /$$$$$$ | $$ /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$\n|  $$ / $$//$$__  $$| $$|_  $$_/   /$$__  $$ /$$__  $$ /$$__  $$|____  $$\n \\  $$ $$/| $$  \\ $$| $$  | $$    | $$$$$$$$| $$  \\__/| $$  \\__/ /$$$$$$$\n  \\  $$$/ | $$  | $$| $$  | $$ /$$| $$_____/| $$      | $$      /$$__  $$\n   \\  $/  |  $$$$$$/| $$  |  $$$$/|  $$$$$$$| $$      | $$     |  $$$$$$$\n    \\_/    \\______/ |__/   \\___/   \\_______/|__/      |__/      \\_______/\n==========================================================================";
    } else {
	output = "================================================\n\
 ___ ___   ___                    _\n\
| __| __| |   \\ ___ _ __  ___    /_\\  _ __ _ __\n\
| _||__ \\ | |) / -_) '  \\/ _ \\  / _ \\| '_ \\ '_ \\ \n\
|_| |___/ |___/\\___|_|_|_\\___/ /_/ \\_\\ .__/ .__/\n\
                                      |_|  |_|\n================================================";
    }
    var upper_scheme = r.variables.scheme.toUpperCase();
    if( r.variables.http2 ) {
      upper_scheme = 'HTTP2';
    }
    output += `

      Node Name: ${r.variables.f5demo_nodename}
     Short Name: ${r.variables.hostname}

      Server IP: ${r.variables.server_addr}
    Server Port: ${r.variables.server_port}

      Client IP: ${r.remoteAddress}
    Client Port: ${r.variables.remote_port}

Client Protocol: ${upper_scheme}
 Request Method: ${r.variables.request_method}
    Request URI: ${r.variables.request_uri}

    host_header: ${r.variables.host}
     user-agent: ${r.variables.http_user_agent}\n`;
  if ( r.variables.http_X_Forwarded_for ) {
     output += 'x-forwarded-for: ' + r.variables.http_X_Forwarded_for + '\n';
 }
  if (r.variables.query_string === "printenv") {
    output += "\n client headers:\n\n";
    for (var h in r.headersIn) {
	output += h.padStart(15) + ": " + r.headersIn[h] + "\n";
    }
  }
    /*
  if (r.variables.http_user_agent == "Frontend App/1.0") {
      output += "\n response_time: upstream_response_time\n";
  }
    */

  if (r.variables.ssl_client_cert) {
    output += "\n client cert:\n\n        ";
    output += r.variables.ssl_client_cert + "\n";
  }
    r.headersOut['Content-Type'] = 'text/plain';    
    r.return(200, output);
}

export default { headers_json, f5demo_txt, backend, ping, pong };
