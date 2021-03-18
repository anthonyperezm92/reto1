let btnscrap = document.getElementById('scrap-profile')

btnscrap.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (tab!== null) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: scrapingProfile,
    });
  }
})

const scrapingProfile = () => {
  const waitFor = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };

  // identificadores constantes
  const qrnombre = '.pv-top-card > div.ph5.pb5 > div.display-flex.mt2 ul li.inline'
  const qrcargo = '.pv-top-card > div.ph5.pb5 > div.display-flex.mt2 h2'
  const qrBtnMas = 'line-clamp-show-more-button'
  const qrResumen = 'section.pv-about-section > p'
  const qrVermas1 = 'pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle'
  const qrVermas2 = 'inline-show-more-text__button link'
  const qrVermas3 = '#experience-section .pv-experience-section__see-more .pv-profile-section__see-more-inline'
  const qrExperiencia = '#experience-section ul'
  const qrEducacion = '#education-section ul'
  ;(async () => {
  // Perfil datos de cabecera
  const nombre = document.querySelector(qrnombre)?.innerText || ''
  const cargo = document.querySelector(qrcargo)?.innerText || ''

  const resumen = document.querySelector(qrResumen)?.innerText || ""
    // Guardo todo en un Profile constant para administrarlo 
    const datos_basicos = {nombre, cargo, resumen}

  // validar si existe el botn ver mas
  const btnVerMAs = document.getElementById(qrBtnMas)
  // Hago clic en él (btn) para ver más, solo si existe.
  if (btnVerMAs) btnVerMAs.click();
  // Se Espera 2 seg 
  await waitFor(2000)
  // luego me desplazo al pie de página de la página
  window.scrollTo(0, document.body.scrollHeight);


  // expandir ves mas
  a = document.getElementsByClassName(qrVermas1);
   for(let i = 0; i < a.length; i++){
        a[i].click();
    }
   a = document.getElementsByClassName(qrVermas2);
    for(let i = 0; i < a.length; i++){
         a[i].click();
     }    
    
     const btnMasExp = document.querySelector(qrVermas3)
		  if (btnMasExp) btnMasExp.click()
      await waitFor(2000)

 
    const arrExper = document.querySelector(qrExperiencia).children

    let experiencia = []

    for(let i = 0; i < arrExper.length; i++){
      if(arrExper[i].getElementsByTagName('a')[0].children.length == 2){ 
        const centro = arrExper[i].querySelector("p.pv-entity__secondary-title")?.innerText || ""
        const periodo = arrExper[i].querySelectorAll("h4 span")[1]?.innerText || ""
        const cargo = arrExper[i].querySelector("h3")?.innerText || ""
        const inicio = periodo.split('–')[0];
        const fin = periodo.split('–')[1];
        const duracion = arrExper[i].querySelectorAll("h4 span")[3]?.innerText || ""

        experiencia.push({centro, periodo, cargo,inicio,fin,duracion})
      }else{

      }

    }
 
    // Educacion
    const arrEducacion = document.querySelector(qrEducacion)
    let estudios = []
    Array.from(arrEducacion.querySelectorAll("li div.pv-entity__summary-info")).map(e => {
      const centro = e.querySelector("h3")?.innerText || ""
      const periodo = e.querySelectorAll("div p.pv-entity__dates span")[1]?.innerText || ""
      let grado = []
      Array.from(e.querySelectorAll("div.pv-entity__degree-info p span"))
        .map((f, k) => {
          if (k % 2 !== 0) {
            grado.push(f.innerText)
          }
        })
      grado = grado.join(", ")
      estudios.push({centro, periodo, grado})
    })

    const perfilObj = {...datos_basicos, experiencia, estudios}
    console.log(perfilObj)
  })()
}