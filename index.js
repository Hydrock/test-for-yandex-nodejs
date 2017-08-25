let MyForm = {
  validate: function () {
    return {1: 2}
  },
  getData: function () {
    return {}
  },
  setData: function() {
    return {}
  },
  submit: function () {
    return {}
  }
};

(function(){
  var submitButton = document.getElementById('submitButton');

  
}());

function validateFio (val) {
  const regexp = /^\w{1,}\s\w{1,}\s\w{1,}$/
  return regexp.test(val)
}

function validateEmail (val) {
  const regexp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+([ru])|([ua])|([kz])|([com]){3,3}$/
  return regexp.test(val)
}