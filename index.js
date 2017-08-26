var myForm = document.getElementById('myForm');
var action = myForm.action
var myInputs = myForm.getElementsByTagName('input')
var submitButton = document.getElementById('submitButton');
var resultContainer = document.getElementById('resultContainer');

/* regexps */
var regexps = {
  fio: /^\w{1,}\s\w{1,}\s\w{1,}$/,
  email: /^[a-z\._0-9]+@(ya|yandex)\.(ru|ua|by|kz|com)$/,
  phone: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
  digit: /^[0-9]{1}$/
}
var namesFields = ['fio', 'email', 'phone'];
/* /regexps */


/* functions */
function validateInput (val, regexp) {
  return regexp.test(val)
}

function validInputSum (val, regexp, max) {
  var string = val.toString().trim();
  var array = string.split('');
  var result = 0;
  for (var i = 0; i < array.length; i++) {
    var element = Number(array[i]);
    if (regexp.test(element)) {
      result = result + element
    }
  }
  if (result <= max) {
    return true;
  }
  return false;
}

function addAlertClass (form, arr) {
  for (var i = 0; i < arr.length; i++) {
    form[arr[i]].classList.add("error");
  }
}

function removeAllAlertClasses (form) {
  for (var i = 0; i < form.length; i++) {
    form[i].classList.remove("error");
  }
}

function disableSubmit(el) {
  el.disabled = true;
}

function resultSuccess(el, text) {
  el.classList.add('success');
  el.innerHTML = text;
}

function resultError(el, text) {
  el.classList.add('error');
  el.innerHTML = text;
}

function resultProgress(el, time) {
  el.classList.add('progress');
  setTimeout(function() {
    sendRequest(action)
  }, time)
}

function sendRequest(action) {
  console.log('send...');
  $.getJSON(action, function(data) {
    console.log(data);
    if (data.status == "success") {
      resultSuccess(resultContainer, data.status);
    } else if (data.status == "error") {
      resultError(resultContainer, data.reason);
    } else if (data.status == "progress") {
      resultProgress(resultContainer, data.timeout)
    }
  });
}

/* /functions */

/* event listeners */

myForm.addEventListener('submit', function(e) {
  e.preventDefault();
  submit();
})

for (var index = 0; index < myInputs.length; index++) {
  myInputs[index].addEventListener('click', function(){
    removeAllAlertClasses(myForm)
  })
}

/* /event listeners */

/* public methods */

function validate() {
  const form = myForm

  var result = {
    isValid: false,
    errorFields: []
  };

  for (var i = 0; i < form.length; i++) {
    switch (form[i].name) {
      case 'fio':
        const fioValid = validateInput(form[i].value, regexps.fio);
        if (!fioValid) {
          result.errorFields.push(form[i].name);
        }
        break;
      case 'email':
        const emailValid = validateInput(form[i].value, regexps.email);
        if (!emailValid) {
          result.errorFields.push(form[i].name);
        }
        break;
      case 'phone':
        const phoneValid = validateInput(form[i].value, regexps.phone);
        const phoneSumValid = validInputSum(form[i].value, regexps.digit, 30);
        if (!phoneValid || !phoneSumValid) {
          result.errorFields.push(form[i].name)
        }
        break;
      default:
        result.isValid = true;
        break;
    }
  }
  if (result.errorFields.length > 0) {
    result.isValid = false;
    addAlertClass(form, result.errorFields)
  } else if (result.errorFields.length == 0) {
    result.isValid = true;
  }
  return result;
}

function getData () {
  const form = myForm;
  var result = {}
  for (var i = 0; i < form.length; i++) {
    if (form[i].name == '') {
      continue;
    }
    result[form[i].name] = form[i].value
  }
  console.log(result)
  return result;
}

function setData(obj) {
  const form = myForm;
  for (var i = 0; i < namesFields.length; i++) {
    for (namesFields[i] in obj) {
      form[namesFields[i]].value = obj[namesFields[i]]
    }
  }
}

function submit() {
  const validateResult = validate();
  
  if (validateResult.isValid) {
    disableSubmit(submitButton);
    sendRequest(action);
    return true;
  }

  return false;
}

/* /public methods */



