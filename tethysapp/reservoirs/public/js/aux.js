function dm(x_array,y_array,units_y,units_x,title_graph){
  var csvData = [];
  var header = [units_y,`${title_graph}(${units_x})`] //main header.
  csvData.push(header);
  for (var i = 0; i < x_array.length; i++){ //data
    var line = [x_array[i],y_array[i]];
    csvData.push(line);
  }
  // var csvFile = csvData.map(e=>e.map(a=>'"'+((a||"").toString().replace(/"/gi,'""'))+'"').join(",")).join("\r\n"); //quote all fields, escape quotes by doubling them.
  var csvFile = csvData.map(e => e.join(",")).join("\n"); //quote all fields, escape quotes by doubling them.
  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${title_graph}` + ".csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function dm2(y_array,y_array2,y_array3,x_array,units_x,units_y,units_y2,units_y3,title_graph){
  var csvData = [];
  var header = [units_x,`${units_y}`,`${units_y2}`,`${units_y3}`] //main header.
  csvData.push(header);
  for (var i = 0; i < x_array.length; i++){ //data
    var line = [x_array[i],y_array[i],y_array2[i],y_array3[i]];
    csvData.push(line);
  }
  // var csvFile = csvData.map(e=>e.map(a=>'"'+((a||"").toString().replace(/"/gi,'""'))+'"').join(",")).join("\r\n"); //quote all fields, escape quotes by doubling them.
  var csvFile = csvData.map(e => e.join(",")).join("\n"); //quote all fields, escape quotes by doubling them.
  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${title_graph}` + ".csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// function dm3(){
//   var doc = new jsPDF();
//   var elementHTML = $('#container_tabs_info').html();
//   var specialElementHandlers = {
//       '#elementH': function (element, renderer) {
//           return true;
//       }
//   };
//   doc.fromHTML(elementHTML, 15, 15, {
//     'width': 170,
//     'elementHandlers': specialElementHandlers
//   });
//
//   // Save the PDF
//   doc.save('sample-document.pdf');
// }
