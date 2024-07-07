// url base de la base
const urlBase = 'https://mindicador.cl/api/'

// capturar elementos del html
const valorInput = document.querySelector("input")
const unidadCambio = document.querySelector("select")
const resultadoFinal = document.querySelector("span")
let myChart= null

async function convertirCurrency (){
    const pesos = valorInput.value
    const {value:monedaSeleccionada} = unidadCambio    
    const valorMoneda= await obntenerApi(monedaSeleccionada)
    console.log("valor de la modeda Seleccionada: ", valorMoneda)
    const valorFinal = (pesos/valorMoneda).toFixed(2)
    console.log(valorFinal);
    resultadoFinal.innerHTML= "El resultado es : " + valorFinal
}

// trabajando con la api. debe ser asincrona para esperar la respuesta de la api

async function obntenerApi(moneda){
    try {
        const result = await fetch (urlBase+moneda)
        const data = await result.json()
        //extrayendo el atributo "serie" desde Data con destructuring
        const {serie} = data
        const datos = crearDatos(serie.slice(0,10).reverse(), moneda)
        renderGrafica(datos)
        console.log("data: ", data)
        return serie[0].valor
    } catch (error) {
        alert("Tenemos un error y estamos trabajando para solucionarlo. Por favor vuelva a ingresar más tarde")
    }
}
// render charts
function renderGrafica(data){
    const config = {
        type:"line",
        data
    }
    const canvas = document.querySelector("#myChart")
    canvas.style.backgroundColor = "white";
    if (myChart){
        myChart.destroy()
    }
    myChart = new Chart(canvas, config);
}

function formatDate(date){
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month}-${day}`
}

function crearDatos(serie, moneda){

    const labels = serie.map(({fecha}) =>formatDate(fecha))
    const data = serie.map(({valor})=>valor)
    const datasets = [
        {
        label: moneda,
        borderColor: "rgb(255, 99, 132)",
        data
        }
        ];
        return { labels, datasets };
}










