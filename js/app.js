const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

//validate
const ciudad = document.querySelector('#ciudad').value;
const pais = document.querySelector('#pais').value;

if(ciudad === '' | pais === ''){
    //error
    mostrarError('Error, both fields are required')
    return;
}
    //consult api
    consultarApi(ciudad,pais);
}

function mostrarError(mensaje){
    const alerta1 = document.querySelector('.bg-red-100');

    if(!alerta1){
    //alert
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 
        'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center')

        alerta.innerHTML = `
            <strong class = "font-bold">ERROR!</strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);

        //erase alert
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarApi(ciudad, pais){
    const appID = '762a0f20afde3e0548edc2ccf9ec1b45'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`

    spinnerDot();

    fetch(url)
        .then (respuesta => respuesta.json())
        .then (datos => {

            //limpiar html
            limpiarHTML();

            if(datos.cod === "404"){
                mostrarError('City not found')
                return;
            }
            //print html
            mostrarClima(datos);
        }) 
}

function mostrarClima(datos){
    const {name, main:{temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinCentigrados(temp);
    const max = kelvinCentigrados(temp_max);
    const min = kelvinCentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent =  ` Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-4xl','text-white','text-center');

    const actual = document.createElement('p');
    actual.innerHTML = ` ${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl', 'text-white','text-center');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`
    tempMaxima.classList.add('text-xl','text-white','text-center');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`
    tempMinima.classList.add('text-xl','text-white','text-center');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultado.appendChild(nombreCiudad);
    resultado.appendChild(actual);
    resultado.appendChild(tempMaxima);
    resultado.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinCentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function spinnerDot(){

    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner', 'color-white');

    divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(divSpinner);
}