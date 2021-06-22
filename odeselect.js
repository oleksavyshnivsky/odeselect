// ————————————————————————————————————————————————————————————————————————————————
//
// ————————————————————————————————————————————————————————————————————————————————
const ODESELECT = new Object
ODESELECT.ajaxon = false		// No simultaneous requests
ODESELECT.getPage = url => {
	return new Promise((resolve, reject) => {
		if (ODESELECT.ajaxon) reject()	// No simultaneous requests
		ODESELECT.ajaxon = true
		var xhr = new XMLHttpRequest()
		xhr.open('GET', url)
		xhr.onload = function() {
			ODESELECT.ajaxon = false
			if (xhr.status === 200) {
				resolve(xhr.responseText)
			} else {
				alert('Request failed.  Returned status of ' + xhr.status)
			}
		}
		xhr.send()
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
Node.prototype.odeselect = function() {
	var id_input = this
	const MINLENGTH = id_input.dataset.odeselectMinlength || 3
	var baseurl = id_input.dataset.odeselectUrl 
	var title_input = id_input.nextElementSibling

	// Додати кнопку закриття
	var btnClose = document.createElement('button')
	btnClose.classList.add('btn')
	btnClose.classList.add('text-danger')
	btnClose.classList.add('odeselect-cancel')
	btnClose.style.display = 'none'
	btnClose.innerHTML = '&times;'
	btnClose.onclick = e => {
		title_input.readOnly = false
		id_input.value = ''
		btnClose.style.display = 'none'
	}
	title_input.parentNode.insertBefore(btnClose, null)

	// Додати меню
	var menu = document.createElement('div')
	menu.classList.add('odeselect-menu')
	menu.onkeydown = e => {
		var keycode = e.keyCode || e.which
		switch (keycode) {
			case 38: 	// Вгору
				e.preventDefault()
				var el = e.target.previousElementSibling
				if (!el) el = title_input
				break
			case 40: 	// Вниз
				e.preventDefault()
				var el = e.target.nextElementSibling
				break
			default:
				var el = null
		}
		if (el) {
			el.focus()
		}
	}
	id_input.parentNode.style.position = 'relative'
	id_input.parentNode.insertBefore(menu, null)

	// Додати дію
	title_input.onkeyup = e => {
		var keycode = e.keyCode || e.which
		switch (keycode) {
			case 40: //  Стрілка вниз
				var el = menu.querySelector('button')
				if (el) el.focus()
				break
			default:
				var value = e.target.value.trim()
				var prev = e.target.dataset.prev
				if (value !== prev) {
					id_input.value = ''
					if (value.length >= MINLENGTH) {
						ODESELECT.getPage(baseurl + '?search=' + e.target.value).then(response => {
							menu.innerHTML = ''
							var options = JSON.parse(response)
							Object.keys(options).forEach((id, i) => {
								var el = document.createElement('button')
								el.dataset.odeselectId = id
								el.classList.add('btn')
								el.innerText = options[id]
								el.onclick = e => {
									var id = e.target.dataset.odeselectId
									var title = e.target.innerText
									id_input.value = id
									title_input.value = title
									menu.innerHTML = ''
									title_input.readOnly = true
									btnClose.style.display = ''
								}
								menu.insertBefore(el, null)
							})
						})
					} else {
						menu.innerHTML = ''
					}
					e.target.dataset.prev = value
				}
		}
	}

	// Виставити початковий стан
	if (id_input.value) {
		title_input.readOnly = true
		btnClose.style.display = ''
	}
}


