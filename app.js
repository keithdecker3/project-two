const urlCoins = 'https://coincap.io/front'
const coinList = document.querySelector('.top-coins')
let coinNames = []
const form = document.querySelector('form')

form.addEventListener('submit', formSubmitted)

fetch(urlCoins)
.then(response => response.json())
.then(coinData => addTopCoins(coinData))

function addTopCoins(coinData) {
  const topCoins = coinData.slice(0,10)
  topCoins.map(coin => {
    coinNames.push(coin.short)
    const coinListItem = document.createElement('li')
    coinListItem.id = `${coin.short}`
    let coinType = document.createElement('h4')
    let coinPrice = document.createElement('p')
    let dayChange = document.createElement('p')
    coinList.appendChild(coinListItem)
    coinType.innerText = `${coin.long} - ${coin.short}`
    coinPrice.innerText = `Current Price : ${coin.price.toFixed(2)}`
    dayChange.innerText = `24 Hour Change: ${coin.cap24hrChange}%`
    coinListItem.appendChild(coinType)
    coinListItem.appendChild(coinPrice)
    coinListItem.appendChild(dayChange)
  })
  addMonthChange(coinNames)
}

function addMonthChange(coinNames) {
  coinNames.map(coin => {  
    const urlMonthChange = `https://coincap.io/history/30day/${coin}`
    fetch(urlMonthChange)
    .then(response => response.json())
    .then(monthData => {
      let change = monthChange(monthData)
      appendChange(change, coin)
    })
  })
}

function monthChange(monthData) {
  const monthStart = monthData.price[0][1]
  const monthEnd = monthData.price[monthData.price.length-1][1]
  const change = ((monthEnd - monthStart) / monthEnd * 100).toFixed(2)
  return change
  }

function appendChange(change, coin) {
  const coinListItem = document.querySelector(`#${coin}`)
  let monthChange = document.createElement('p')
  monthChange.innerText = `30 Day Change: ${change}%`
  coinListItem.appendChild(monthChange)
}

function formSubmitted() {
  event.preventDefault()
  const searchCoinType = document.querySelector('#search-heading')
  const searchCoinPrice = document.querySelector('#search-price')
  const searchDayChange = document.querySelector('#search-day')
  const searchMonthChange = document.querySelector('#search-month')
  const formData = new FormData(form)
  const search = formData.get('search').toUpperCase()
  fetch(urlCoins)
  .then(response => response.json())
  .then(coinData => {
    const findCoin = coinData.filter(coin => coin.short === search)
    if (findCoin.length === 0) {
      searchCoinType.innerText = 'Could not find coin'
      searchCoinPrice.innerText = ''
      searchDayChange.innerText = ''
      searchMonthChange.innerText = ''
    }
    searchCoinType.innerText = `${findCoin[0].long} - ${findCoin[0].short}`
    searchCoinPrice.innerText = `Current Price : ${findCoin[0].price.toFixed(2)}`
    searchDayChange.innerText = `24 Hour Change: ${findCoin[0].cap24hrChange}%`
  })
  fetch(`https://coincap.io/history/30day/${search}`)
  .then(response => response.json())
  .then(monthData => {
    let change = monthChange(monthData)
    searchMonthChange.innerText = `30 Day Change: ${change}%`
  })
}

