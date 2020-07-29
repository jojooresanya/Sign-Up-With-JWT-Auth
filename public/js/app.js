const closeBtns = [...document.querySelectorAll('.close')]

closeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.parentElement.remove()
  })
})
