function loadComments(id) {
    const xhttp = new XMLHttpRequest();
    console.log(id);
    xhttp.onload = function() {
    var ele=document.getElementById(id);
    
    var array=JSON.parse(this.responseText);
    for(var i=0;i<array.length;i++){
        var row=document.createElement('div');
        row.setAttribute('class','row');
        var col=document.createElement('div');
        col.setAttribute('class','col-12');
        var user=document.createElement('div');
        var uText=document.createTextNode(array[i].commentBy +" on "+array[i].time);
        user.appendChild(uText);
        var comment = document.createElement('div');
        var cText = document.createTextNode(array[i].comment);
        comment.appendChild(cText);
        comment.setAttribute('id',array[i]._id);
        col.appendChild(user);
        col.appendChild(comment);
        row.appendChild(col);
        ele.appendChild(row);
    }
    // console.log(typeof(this.responseText));
    }
    xhttp.open("GET", "/forum/loadComments/"+id);
    xhttp.send();
  }

function loadReply(id){
    var x="reply"+id;
    document.getElementById(x).style.display="block";
}

function delReply(id){
    document.getElementById(id).style.display="none";
}