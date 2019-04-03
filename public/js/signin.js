function asignin()
{
	if(document.getElementsByClassName("s")[0].value!=""&&document.getElementsByClassName("s")[1].value!=""&&document.getElementsByClassName("s")[2].value!=""&&document.getElementById("scheckbox").checked!=false){
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
		if(xmlhttp.responseText==="false susername"){
			document.getElementsByClassName("error_susername")[0].style.transform="translateY(0)";
		}
		else{
			window.location.href="/";
		}
    }
  }
xmlhttp.open("post","/signin",true);
xmlhttp.setRequestHeader("Content-type","application/json");
xmlhttp.send(JSON.stringify({susername: document.getElementsByClassName("susername")[0].value,spassword: document.getElementsByClassName("spassword")[0].value,sname: document.getElementsByClassName("sname")[0].value}));
}}