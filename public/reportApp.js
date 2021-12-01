function delReport(id) {
    console.log(id);

  var del = confirm("Are you sure that you want to delete this Report?");
if (del == true) {

 const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      if(this.responseText=="ReportDeleted"){
          location.reload();
      }
  }
  xhttp.open("GET", "/prevReport/deleteReport/"+id);
  xhttp.send();
}
}

function loadMore() {
  const xhttp = new XMLHttpRequest();
  //console.log(id);
  const cont=document.getElementsByTagName("BODY")[0];
  xhttp.onload = function() {
    cont.innerHTML=this.response;
  console.log('Loaded all reports.....');
  
  }
  xhttp.open("GET", "loadMorePrevReports");
  xhttp.send();
}