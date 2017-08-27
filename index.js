(function(){

/* regexps */
const regexps = {
  fio: /^[a-zA-Zа-яА-Я0-9_]{1,}\s[a-zA-Zа-яА-Я0-9_]{1,}\s[a-zA-Zа-яА-Я0-9_]{1,}$/,
  email: /^[a-zA-Z\._0-9]+@(ya|yandex)\.(ru|ua|by|kz|com)$/,
  phone: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
  digit: /^[0-9]{1}$/
}
/* /regexps */

const namesFields = ['fio', 'email', 'phone'];

/* elements */
const myForm = document.getElementById('myForm');
const action = myForm.action
const myInputs = myForm.getElementsByTagName('input')
const submitButton = document.getElementById('submitButton');
const resultContainer = document.getElementById('resultContainer');
/* /elements */

/* common functions */
function validateInput (val, regexp) {
  return regexp.test(val)
}

function validInputSum (val, regexp, max) {
  const string = val.toString().trim();
  const array = string.split('');
  let result = 0;
  for (let i = 0; i < array.length; i++) {
    const element = Number(array[i]);
    if (regexp.test(element)) {
      result = result + element
    }
  }
  if (result < max) {
    return true;
  }
  return false;
}

function addAlertClass (form, arr) {
  for (let i = 0; i < arr.length; i++) {
    form[arr[i]].classList.add("error");
  }
}

function removeAllAlertClasses (form) {
  for (let i = 0; i < form.length; i++) {
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

function resultProgress(el, time, action) {
  el.classList.add('progress');
  setTimeout(function() {
    sendRequest(action, resultContainer)
  }, time)
}

function sendRequest(action, targetElement) {
  console.log('send...');
  $.getJSON(action, function(data) {
    if (data.status == "success") {
      resultSuccess(targetElement, data.status);
    } else if (data.status == "error") {
      resultError(targetElement, data.reason);
    } else if (data.status == "progress") {
      resultProgress(targetElement, data.timeout, action)
    }
  });
}
/* /common functions */

/* events listeners */
myForm.addEventListener('submit', function(e) {
  e.preventDefault();
  submit();
})

for (var index = 0; index < myInputs.length; index++) {
  myInputs[index].addEventListener('click', function(){
    removeAllAlertClasses(myForm);
  })
  myInputs[index].addEventListener('input', function(){
    removeAllAlertClasses(myForm);
  })
}
/* /events listeners */

/* methods */
function validate() {
  const form = myForm;
  let result = {
    isValid: false,
    errorFields: []
  };

  for (var i = 0; i < form.length; i++) {
    switch (form[i].name) {
      case namesFields[0]:
        const fioValid = validateInput(form[i].value, regexps.fio);
        if (!fioValid) {
          result.errorFields.push(form[i].name);
        }
        break;
      case namesFields[1]:
        const emailValid = validateInput(form[i].value, regexps.email);
        if (!emailValid) {
          result.errorFields.push(form[i].name);
        }
        break;
      case namesFields[2]:
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
  let result = {}
  for (var i = 0; i < form.length; i++) {
    if (form[i].name == '') {
      continue;
    }
    result[form[i].name] = form[i].value
  }
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
    sendRequest(action, resultContainer);
    return true;
  }
  return false;
}
/* /methods */

/* public methods */
window.validate = validate;
window.getData = getData;
window.setData = setData;
window.submit = submit;
/* /public methods */

}());

