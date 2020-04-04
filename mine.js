let axios = require("axios");
let jsonframe = require("jsonframe-cheerio");
let cheerio = require("cheerio");

let url = "https://www.immobilienscout24.de/expose/116959945";
url = 'https://www.immobilienscout24.de/Suche/de/berlin/berlin/kreuzberg-kreuzberg/wohnung-mieten?pagenumber=1'

let getURL = (pageNum) => {
  return `https://www.immobilienscout24.de/Suche/de/berlin/berlin/kreuzberg-kreuzberg/wohnung-mieten?pagenumber=${pageNum}`
}
const parsePrice = (text) => {
    return /(\d?\.?\d+\D?\d*)\s*€/.exec(text)[1].replace(/,\d\d/g, '').replace(/\./g,'')
};

const getFlats = (url) => new Promise((resolve, reject) => {
  let list = [];
  let data = {};
  axios.get(url).then(html => {
    let $ = cheerio.load(html.data);
    // let list = $('a', '.result-list-entry__data').attr('href');
    $('.result-list-entry__brand-title-container').each(function (i, element) {
          let path = $(this).attr('href');
          if(path.length < 20){
            data[path] = {url:'https://www.immobilienscout24.de' + path}
            list.push('https://www.immobilienscout24.de' + path);
            let flat = {"url":'https://www.immobilienscout24.de' + path};
            axios.get(flat.url).then(html => {
              let $ = cheerio.load(html.data);
              flat.name = $('#expose-title').text();
              data[path].name = $('#expose-title').text();
              flat.price = parsePrice($('.is24-preis-value').text())
              data[path].price = parsePrice($('.is24-preis-value').text())
              flat.rooms = $('.is24qa-zimmer').text();
              data[path].rooms = $('.is24qa-zimmer').text();
              flat.sqm = parseInt($('.is24qa-wohnflaeche-ca').text());
              data[path].sqm = parseInt($('.is24qa-wohnflaeche-ca').text());
              flat.ppsqm = (flat.price / flat.sqm);
              data[path].ppsqm = (flat.price / flat.sqm);
              // flat.deposit = parsePrice($('.is24qa-kaution-o-genossenschaftsanteile').text());
              // flat.desc = $('.is24qa-objektbeschreibung').text() + $('.is24qa-ausstattung').text() + $('.is24qa-lage').text();
              // flat.equip = $('.is24qa-ausstattung').text();
              // flat.loc = $('.is24qa-lage').text();
              // flat.misc = $('is24qa-sonstiges').text();
              // console.log(data);
            })
          }
    });
    resolve(data);
  });
  // console.log(data);
});



let list = {}
getFlats(getURL(1)).then(result => {Object.assign(list, result)});
getFlats(getURL(2)).then(result => {Object.assign(list, result)});
getFlats(getURL(3)).then(result => {Object.assign(list, result)});
getFlats(getURL(4)).then(result => {Object.assign(list, result)});
getFlats(getURL(5)).then(result => {Object.assign(list, result)});
// getFlats(getURL(2)).then(result => {list += result});
setTimeout(function(){
  console.log(list);
  console.log(Object.keys(list).length)
}, 15000);
