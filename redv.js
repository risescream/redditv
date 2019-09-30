window.addEventListener("load", myonload);
var myvideo;
var myaudio;
var myerror;
var myform;

function myonsubmit(evt) {
  var url;
  try {
    evt.preventDefault();
    url = new URL(document.getElementById("myurl").value);
    if (url.host == "v.redd.it") {
      myerror.innerHTML = "v.redd.it links are not supported"
      return false;
    }
    var script = document.createElement('script');
    script.src = "//" + url.host + url.pathname + ".json?jsonp=callback";
    document.getElementsByTagName('head')[0].appendChild(script);
    myerror.innerHTML = "";
  } catch (e) {
    myerror.innerHTML = "That's not a valid link";
  } finally {
    return false;
  }
}

function callback(value){
  try {
    myvideo.src = value["0"].data.children["0"].data.secure_media.reddit_video.fallback_url;
    myaudio.src = value["0"].data.children["0"].data.url + "/audio";
    var n = value["0"].data.children["0"].data.name.substring(3)
    var v = value["0"].data.children["0"].data.url;
    v = v.substring(v.lastIndexOf("/") + 1);
    var s = new URL(value["0"].data.children["0"].data.secure_media.reddit_video.fallback_url);
	s = s.pathname
    s = s.substring(s.lastIndexOf("_") + 1);
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?n=" + n + "&v=" + v + "&s=" + s;
    window.history.pushState({ path: newurl }, '', newurl);
    
    var a = document.createElement('a');
    a.href = "https://www.reddit.com/" + n;
    a.innerText = "reddit";
    linkback.innerHTML = "";
    linkback.appendChild(a);
	myform.hidden = true;
    
    myerror.innerHTML = "";
  } catch (e) {
    myerror.innerHTML = "Couldn't find a video in that link";
  }
}

function myonload(){
  myvideo = document.getElementById("myvideo");
  myaudio = document.getElementById("myaudio");
  linkback = document.getElementById("linkback");
  myform = document.getElementById("myform");
  myvideo.onplay  = function() { myaudio.play();  }
  myvideo.onpause = function() { myaudio.pause(); }
  myvideo.addEventListener("seeked", function() { myaudio.currentTime = myvideo.currentTime; }, true);

  myerror = document.getElementById("myerror");
  
  myform.addEventListener("submit", myonsubmit, true);

  var url = new URL(window.location.href);
  var n = url.searchParams.get("n");
  var v = url.searchParams.get("v");
  var s = url.searchParams.get("s");
  if (v) {
    v = v.replace(/\W/g, '');
    if (s) {
      s = s.replace(/\W/g, '');
    } else {
      s = 96;
    }
    myvideo.src = "https://v.redd.it/" + v + "/DASH_" + s;
    myaudio.src = "https://v.redd.it/" + v + "/audio";
    var a = document.createElement('a');
    a.href = "https://v.redd.it/" + v;
    a.innerText = "reddit";
    linkback.innerHTML = "";
    linkback.appendChild(a);
	myform.hidden = true;
  } else if (n) {
    n = n.replace(/\W/g, '');
    var script = document.createElement('script');
    script.src = "//www.reddit.com/" + n + ".json?jsonp=callback";
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}