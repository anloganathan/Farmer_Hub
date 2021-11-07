function loadComments(id) {
    const xhttp = new XMLHttpRequest();
    //console.log(id);
    xhttp.onload = function() {
    var ele=document.getElementById('Comments'+id);
    ele.parentNode.style.display="block";
    ele.textContent='';
    ele.style.display="block";
    var array=JSON.parse(this.responseText);
    for(var i=0;i<array.length;i++){
        var row=document.createElement('div');
        row.setAttribute('class','row');
        var col=document.createElement('div');
        col.setAttribute('class','col-12');
        var field=document.createElement('fieldset');
        field.setAttribute('class','w3-panel w3-border w3-round-small w3-leftbar w3-border-grey');
        var user=document.createElement('legend');
        user.style.fontSize="12px"
        user.style.fontStyle="italic"
        var uText=document.createTextNode(" comment by " +array[i].commentBy +"  on "+array[i].time);
        user.appendChild(uText);
        var comment = document.createElement('div');
        var cText = document.createTextNode(array[i].comment);
        comment.appendChild(cText);
        comment.setAttribute('id',array[i]._id);
        field.appendChild(user);
        field.appendChild(comment);
        col.appendChild(field);
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

function delPost(id) {
    var del = confirm("Are you sure that you want to delete this post?");
  if (del == true) {
   console.log(id+" "+del);
   const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if(this.responseText=="deleted"){
            location.reload();
        }
    }
    xhttp.open("GET", "/forum/deletePost/"+id);
    xhttp.send();
  }
  }