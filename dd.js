//importaciones
const puppeteer = require('puppeteer');
const fs = require('fs')

//variables
const data = {}
const nombreArchivo = 2 //cambiar nombre de archivo json idmoviles

//leer data entrada


//importar json desde archivo local
const jsonData= fs.readFileSync(`./data/${nombreArchivo}.json`); //formula excel convertir id/ip en json
const objetojson = JSON.parse(jsonData)
//console.log(objetojson);

function accederANvr(iplte, numeroMovil) {
  const timestamp = (new Date(Date.now())).toLocaleString();
  console.log(`${timestamp} inicia SCRIP al movil= ${numeroMovil} con ip= ${iplte}`);
  (async() => {
      const browser = await puppeteer.launch( {headless: true}); //FALSE=ver lo que esta pasando en el navegador
      const page = await browser.newPage();
      await page.setViewport({ //tamaño de pantalla chromium
          width: 1280,
          height: 1000,
        });
    try {  //capturar los errores
      data.numeroMovil = numeroMovil
      data.iplte = iplte
      console.log(`TRY ingresa a movil: ${numeroMovil} con ip: ${iplte}`);
      //await page.waitFor(3000);
      
      await page.goto(`http://${iplte}/`);
      await page.waitForSelector('body > div > div.content > div.panel.login-panel > div > div.panel-field.hint-message > div > span')
      //await page.waitFor(5000);
      await page.screenshot({ path: `./img/${numeroMovil}-inicio.jpg` }) //para capturar pantalla en la misma carpeta del proyecto
      await page.type('input[id="username"]', 'admin'); //hacer login
      await page.type('input[id="password"]', 'S1st3m4_CCTv_NVRCi2.2022$');
      await page.click('body > div > div.content > div.panel.login-panel > div > div.button-list > button');
      await page.waitForSelector('body > div > div.header > div.right.inner-wrapper > div.system-time-display > div > div.time')
      //await page.waitFor(5000);
      
      await page.goto(`http://${iplte}/settings.html#!settings/settings_storage_storage`);
      await page.waitForSelector('#disk-infomation-0 > div:nth-child(1) > div > div:nth-child(5) > div.small-8.columns > span')
      //await page.waitFor(5000);
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
      
    } catch (error) {
      console.log(`❌CATCH= no se puede acceder al disco duro del movil ${numeroMovil} del nvr⚡☢️`)

      const saveLogError = () => {
        const lineaDeDatosError = `${timestamp}; ${numeroMovil}; ${iplte}; ERROR\n`
        fs.appendFile('./log/log.csv', lineaDeDatosError, {encoding: 'utf8', flag: 'a'}, (error) => {
          if (error) throw error;
          //console.log(`registro del movil= ${numeroMovil} guardado ERRORRRRRRRRRR= ./log/log.csv`)
        })
      }

      saveLogError()
    }    
    await browser.close()

    }) ();
}

  for(numeroMovil in objetojson) {
    iplte = objetojson[numeroMovil]
    idmovil = numeroMovil
    //console.log(objetojson[numeroMovil]) 
    //console.log(numeroMovil)
    accederANvr(iplte, numeroMovil)
  }


