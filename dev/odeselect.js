/**
 * @file AJAX-populated options
 * @copyleft Oleksa Vyshnivsky <dying.escape@gmail.com> 2022
 * @license The MIT License (MIT)
 */

 /**
  * 
<div>
	<input type="hidden" id="item-id" name="item" value=""
	 data-os-url="/json/items" data-os-minlength="1">
	<input type="text" name="item-string" value="">
	<script>document.getElementById('item-id').odeselect()</script>
</div>
 * 
 */


// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
Node.prototype.odeselect = function() {
	const inputId = this
	const inputTitle = inputId.nextElementSibling
	const MINLENGTH = parseInt(inputId.dataset.osMinlength) || 1
	const BASEURL = inputId.dataset.osUrl

	// ————————————————————————————————————————————————————————————————————————————————
	// "Close" button
	// ————————————————————————————————————————————————————————————————————————————————
	const btnClose = document.createElement('button')
	btnClose.classList.add('btn')			// Bootstrap class
	btnClose.classList.add('text-danger')	// Bootstrap class
	btnClose.classList.add('odeselect-cancel')
	btnClose.style.display = 'none'
	btnClose.style.position = 'absolute'
	btnClose.innerHTML = '&times;'
	btnClose.type = 'button'
	btnClose.onclick = e => {
		inputTitle.readOnly = false
		inputId.value = ''
		btnClose.style.display = 'none'
	}
	inputTitle.parentNode.insertBefore(btnClose, null)

	// ————————————————————————————————————————————————————————————————————————————————
	// Menu
	// ————————————————————————————————————————————————————————————————————————————————
	const menu = document.createElement('div')
	menu.classList.add('odeselect-menu')
	menu.onkeydown = e => {
		switch (e.code) {
			case 'ArrowUp':
				e.preventDefault()
				var el = e.target.previousElementSibling
				if (!el) el = inputTitle
				break
			case 'ArrowDown':
				e.preventDefault()
				var el = e.target.nextElementSibling
				break
			case 'Escape':
				menu.innerHTML = ''
				inputTitle.focus()
				break
			default:
				var el = null
		}
		if (el) el.focus()
	}
	inputId.parentNode.style.position = 'relative'
	inputId.parentNode.insertBefore(menu, null)

	// ————————————————————————————————————————————————————————————————————————————————
	// Action listeners
	// ————————————————————————————————————————————————————————————————————————————————
	inputTitle.onkeyup = async e => {
		switch (e.code) {
			// ————————————————————————————————————————————————————————————————————————————————
			// Down to Options menu
			// ————————————————————————————————————————————————————————————————————————————————
			case 'ArrowDown':
				var el = menu.querySelector('button')
				if (el) el.focus()
				break
			case 'Escape':
				menu.innerHTML = ''
				break
			// ————————————————————————————————————————————————————————————————————————————————
			// Update Options menu
			// ————————————————————————————————————————————————————————————————————————————————
			default:
				var value = e.target.value.trim()
				if (value !== e.target.dataset.previous) {
					inputId.value = ''
					if (value.length >= MINLENGTH) {
						// ————————————————————————————————————————————————————————————————————————————————
						// URL preparation
						// ————————————————————————————————————————————————————————————————————————————————
						var params = {search: value}
						document.querySelectorAll('[data-os-for="'+inputId.dataset.os+'"]').forEach(el => {
							params[el.dataset.osFactor] = el.value
						})
						// ————————————————————————————————————————————————————————————————————————————————
						// Server call and parsing
						// ————————————————————————————————————————————————————————————————————————————————
						var response = await fetch(BASEURL + '?' + new URLSearchParams(params))
						if (response.ok) {
							var options = await response.json()
							menu.innerHTML = ''
							Object.keys(options).forEach((id, i) => {
								var el = document.createElement('button')
								el.dataset.osId = id
								el.classList.add('btn')
								el.innerText = options[id]
								el.onclick = e => {
									inputId.value = e.target.dataset.osId
									inputTitle.value = e.target.innerText
									menu.innerHTML = ''
									inputTitle.readOnly = true
									btnClose.style.display = ''
									var callback = inputId.dataset.osCallback
									if (callback && typeof window[callback] === 'function')
										window[callback]()
								}
								menu.insertBefore(el, null)
							})
						} else {
							alert('HTTP-Error: ' + response.status);
						}
					} else {
						menu.innerHTML = ''
					}
					e.target.dataset.previous = value
				}
		}
	}

	// ————————————————————————————————————————————————————————————————————————————————
	// If there is an initial value, set the field as readonly
	// ————————————————————————————————————————————————————————————————————————————————
	if (inputId.value) {
		inputTitle.readOnly = true
		btnClose.style.display = ''
	}
}
