window.onload = function () {
  const favicon = document.getElementById('favicon')
  const pageTitle = document.title
  const attentionMessage = 'Kembalilah!'

  document.addEventListener('visibilitychange', function (e) {
    const isPageActive = !document.hidden
    toggle(isPageActive)
  })

  function toggle(isPageActive) {
    if (isPageActive) {
      document.title = pageTitle
      favicon.href = './assets/images/dp_male.png'
    } else {
      document.title = attentionMessage
      favicon.href = './assets/images/folded.png'
    }
  }
}