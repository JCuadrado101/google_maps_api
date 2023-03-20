
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`https://widgetdata.azurewebsites.net/atms/search?lat=40.7128&long=-74.0060&radius=10`, requestOptions)
    .then(response => response.text())
    .then(result => {
        let data = JSON.parse(result);
      console.log(data['data']);
    })
    .catch(error => console.log('error', error));
  
