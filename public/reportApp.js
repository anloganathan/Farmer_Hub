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