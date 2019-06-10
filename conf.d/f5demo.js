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


function headers_json(r) {
    r.headersOut['Content-Type'] = 'applicaion/json';    
    r.return(200, JSON.stringify(kvHeadersDict(r.headersIn)) + '\n');
}
function f5demo_txt(r) {
    var output = "================================================\n\
 ___ ___   ___                    _\n\
| __| __| |   \\ ___ _ __  ___    /_\\  _ __ _ __\n\
| _||__ \\ | |) / -_) '  \\/ _ \\  / _ \\| '_ \\ '_ \\ \n\
|_| |___/ |___/\\___|_|_|_\\___/ /_/ \\_\\ .__/ .__/\n\
                                      |_|  |_|\n================================================";
    var upper_scheme = r.variables.scheme.toUpperCase();
    if( r.variables.http2 ) {
      upper_scheme = 'HTTP2';
    }
    output += `

      Node Name: F5 Docker vLab
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


    r.headersOut['Content-Type'] = 'text/plain';    
    r.return(200, output);
}

