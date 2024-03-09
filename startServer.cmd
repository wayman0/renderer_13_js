IF "%1" == "" (http-server -p 8080 -c-1 -o ./index.html) ELSE (http-server -c-1 -p 8080 -o %1)
