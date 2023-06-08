const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Activer l'enregistrement des requêtes
  await page.setRequestInterception(true);
  tokens = [];
  // Intercepter les requêtes’
  page.on("request", (request) => {
    if (
      request.url() ===
      "https://rpcache-aa.meteofrance.com/internet2018client/2.0/forecast/marine?lat=16.15&lon=-61.5&id="
    ) {
      // Récupérer les headers de la requête
      const headers = request.headers();

      if (headers.authorization != undefined) {
        tokens.push(headers.authorization);
        //console.log(tokens);
        if (tokens[0] == tokens[1]) {
          tokens.pop();
          console.log(tokens[0]);
          token = tokens[0].replace(/Bearer /, "");
          return tokens;
        }
      }
    }
    request.continue();
  });
  // Naviguer vers une URL
  await page.goto(
    "https://meteofrance.gp/fr/marine/guadeloupe/petit-cul-de-sac-marin"
  );
  console.log(token);

  const response = await fetch(
    "https://rpcache-aa.meteofrance.com/internet2018client/2.0/forecast/marine?lat=16.15&lon=-61.5&token=" +
      token
  );
  const data = await response.json();

  //console.log(data);
  Object.entries(data).forEach(function ([key, value]) {
    console.log(key, ":", value);
  });
  await browser.close();
})();

/*
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
  await page.setViewport({width: 1080, height: 1024});
	await page.goto('https://meteofrance.gp/fr/marine/guadeloupe/petit-cul-de-sac-marin');
  const tokens = [];
  const result = await page.evaluate(() => {
    let day = document.querySelector('#previsions-marine > div > div.prev-right > div:nth-child(1)').innerText
    day = day.split('\n')
    let hour = document.querySelector('#previsions-marine > div > div.prev-right > div:nth-child(2)').innerText
    hour = hour.split('\n')
    let waveMeter = document.querySelector('#previsions-marine > div > div.prev-right > div:nth-child(7) > div:nth-child(1) > div > div').innerText
    return { day,hour,waveMeter}
  })
  console.log(result)
  //console.log(result.waveMeter + ' m')

  // Vérifier si la hauteur des vagues est inférieure à 1 mètre
  if (result.waveMeter < 1.5) {
    console.log(`ALERTE : La hauteur des vagues est de ${result.waveMeter} mètre(s)`);
    // Ici vous pouvez ajouter votre propre méthode d'alerte comme l'envoi d'un email ou une notification push
    
  } else {
    console.log(`La hauteur des vagues est de ${result.waveMeter} mètre(s)`);

  }
	
	await browser.close();
})();

*/
