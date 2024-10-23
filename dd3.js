// example file
// archivojson.json
// {
//   "buses": [
//   { "bus": "Z63-4025", "ip": "172.23.11.125" },
//   { "bus": "Z63-4026", "ip": "172.23.11.126" },
//   { "bus": "Z63-4027", "ip": "172.23.11.127" }
//   ]
// }

//importaciones
const puppeteer = require('puppeteer');
const fs = require('fs')

//variables
const data = {}
const nombreArchivo = "archivojson" //cambiar nombre de archivo json idmoviles

//leer data entrada


//importar json desde archivo local
const jsonData= fs.readFileSync(`./data/${nombreArchivo}.json`); //formula excel convertir id/ip en json
const objetojson = JSON.parse(jsonData);
console.log(objetojson);

function accederANvr(iplte, numeroMovil) {
  const timestamp = (new Date(Date.now())).toLocaleString();
  console.log(`${timestamp} inicia SCRIP al movil= ${numeroMovil} con ip= ${iplte}`);
  (async() => {
      const browser = await puppeteer.launch( {headless: false}); //FALSE=ver lo que esta pasando en el navegador
      const page = await browser.newPage();
      await page.setViewport({ //tamaño de pantalla chromium
          width: 1280,
          height: 1000,
        });
      //capturar los errores
      data.numeroMovil = numeroMovil
      data.iplte = iplte
      console.log(`TRY ingresa a movil: ${numeroMovil} con ip: ${iplte}`);
      
      await page.goto(`http://${iplte}/`);
      console.log(`ingreso a ipiiiiiiiiiiii`);

      await new Promise(resolve => setTimeout(resolve, 5000));
      await page.waitForSelector('body > div > div.content > div.panel.login-panel > div > div.panel-field.hint-message > div > span')
      await page.screenshot({ path: `./img/${numeroMovil}-inicio.jpg` }) //para capturar pantalla en la misma carpeta del proyecto
      await page.type('input[id="username"]', 'admin'); //hacer login
      await page.type('input[id="password"]', 'T3CN0L0G1A@@@...');
      await page.click('body > div > div.content > div.panel.login-panel > div > div.button-list > button');
      await page.waitForSelector('body > div > div.header > div.right.inner-wrapper > div.system-time-display > div > div.time')
      
      await page.goto(`http://${iplte}/settings.html#!settings/settings_storage_storage`);
      await page.waitForSelector('#disk-infomation-0 > div:nth-child(1) > div > div:nth-child(5) > div.small-8.columns > span')
      await new Promise(resolve => setTimeout(resolve, 5000));
      let espacioUsadoDD = await page.evaluate(() => document.querySelector('#modelControlElement-Volume0 > div.volume-content > form > div > div > div > div.large-7.columns.volumes > div > div.row.volume-status.show-for-large-up > div > span:nth-child(3)').textContent)
      console.log(`👉👉👉FIN = El disco duro del movil ${numeroMovil} tiene espacio usado: ${espacioUsadoDD}`)
      await page.screenshot({ path: `./img/${numeroMovil}-disco.jpg` }) //para capturar pantalla DE DISCO DURO en la misma carpeta del proyecto
      
      const saveLog = () => {
        const lineaDeDatos = `${timestamp}; ${numeroMovil}; ${iplte}; ${espacioUsadoDD} \n`
        fs.appendFile('./log/log.csv', lineaDeDatos, {encoding: 'utf8', flag: 'a'}, (error) => {
          if (error) throw error;
          //console.log(`registro del movil= ${numeroMovil} guardado exitosamente en= ./log/log.csv`)
        })
      }
      saveLog()
      console.log(`se guardo info ssd info ssd movil: ${numeroMovil} con ip: ${iplte}`);
      
        
    await browser.close()

    }) ();
}

  // for(numeroMovil in objetojson) {
  //   iplte = objetojson[numeroMovil]
  //   idmovil = numeroMovil
  //   console.log("accediendo a funcion accerdernvr") 
  //   console.log(objetojson[numeroMovil]) 
  //   console.log(numeroMovil)
  //   accederANvr(iplte, numeroMovil)
  // }

//   objetojson.buses.forEach(bus => {
//     numeroMovil = bus.bus;
//     iplte = bus.ip;
//     console.log(`busbus: ${numeroMovil}, ipip: ${iplte}`);
//     accederANvr(iplte, numeroMovil)
// });

for (let i in objetojson.buses) {
  let bus = objetojson.buses[i];
  let numeroMovil = bus.bus;
  let iplte = bus.ip;
  console.log(`busbus: ${numeroMovil}, ipip: ${iplte}`);
  accederANvr(iplte, numeroMovil);
}