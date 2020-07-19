var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

/*
xhttp.onreadystatechange = function (){
    if (xhttp.readyState == 4 && xhttp.status == 200){
        xmlDoc = xhttp.responseXML;
    }
}
*/

xhr.open('GET','192.168.1.200:8090/info', true);
xhr.send();
console.log(xhr.responseXML);
