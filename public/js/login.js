


function showHint()
{
	if(document.getElementsByClassName("l")[0].value!=""&&document.getElementsByClassName("l")[1].value!=""&&document.getElementById('checkbox').checked!=false){
var xmlhttp;
if (window.XMLHttpRequest)
  {
  xmlhttp=new XMLHttpRequest();
  }
else
  {
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
		if(xmlhttp.responseText=="false username"){
			document.getElementsByClassName("error_username")[0].style.transform="translateY(0)";
		}
		if(xmlhttp.responseText=="success"){
			window.location.href="/";
		}
    	if(xmlhttp.responseText=="false password"){
			document.getElementsByClassName("error_password")[0].style.transform="translateY(0)";
		}
    }
  }
xmlhttp.open("post","/login",true);
xmlhttp.setRequestHeader("Content-type","application/json");
xmlhttp.send(JSON.stringify({username: document.getElementsByClassName("username")[0].value,
			 password:document.getElementsByClassName("password")[0].value
			 }))
}}