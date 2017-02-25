(() => {

  let id, count = 3;

  const countdownTimer = () => {
    if (count > 0) {
      document.getElementById('redirect-wait').innerHTML = `Please wait ${count--}s`;
    } else {
      document.getElementById('redirect-wait').style.display = 'none';
      document.getElementById('redirect-link').style.display = 'inherit';
      clearInterval(id);
    }
  }

  document.getElementById('redirect-wait').innerHTML = `Please wait ${count--}s`;
  id = setInterval(countdownTimer, 1000);

})();
