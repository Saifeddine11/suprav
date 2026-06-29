export function createHubMarkerElement(name) {
  const el = document.createElement('div')
  el.className = 'targeting-globe__marker targeting-globe__marker--hub'
  el.innerHTML = `
    <span class="targeting-globe__marker-dot" aria-hidden="true"></span>
    <span class="targeting-globe__marker-label">${name}</span>
  `
  return el
}

export function createDestMarkerElement({ emphasis = false } = {}) {
  const el = document.createElement('div')
  el.className = `targeting-globe__marker targeting-globe__marker--dest${emphasis ? ' is-emphasis' : ''}`
  el.innerHTML = '<span class="targeting-globe__marker-dot" aria-hidden="true"></span>'
  return el
}
