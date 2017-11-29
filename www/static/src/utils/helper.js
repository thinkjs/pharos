module.exports = {
  getDataFromLs(key){
    let data = localStorage.getItem(key);
    if(data && data !== 'undefined'){
      data = JSON.parse(data);
    }
    return data;
  }
}