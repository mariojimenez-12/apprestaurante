let pagina = 1;

const menu = {
    nombre: '',
    fecha: '',
    hora: '',
    menuServicio: []
}

document.addEventListener('DOMContentLoaded', function(){
    mostrarServicios();
    //resalta el div actual segun el tab al que presiona
    mostrarSeccion();

    cambiarSeccion();

    paginaSiguiente();
    paginaAnterior();

    botonesPaginador();

    mostrarResumen();

    nombreCita();

    fechaCita();

    deshabilitarFechaAnterior();

    horaCita();
})

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
   
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();

        })
    })
}


async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { menu } = db;

        //generar el HTML
        menu.forEach(menuComida => {
            const {id, nombre, precio} = menuComida;

            //DOM scripting
            //generar el nombre del menu 
            const nombreMenu = document.createElement('P');
            nombreMenu.textContent = nombre;
            nombreMenu.classList.add('nombre-servicio');

            //generar el precio del menu
            const precioMenu = document.createElement('P');
            precioMenu.textContent = `$ ${precio}`;
            precioMenu.classList.add('precio-servicio');

            //generar el DIV contenedor del Menu
            const menuDiv = document.createElement('DIV');
            menuDiv.classList.add('servicio');
            menuDiv.dataset.idMenu = id;

             // Selecciona un servicio para la cita
            menuDiv.onclick = seleccionarServicio;

            //inyectar precio y nombre en el div del menu
            menuDiv.appendChild(nombreMenu);
            menuDiv.appendChild(precioMenu);

            //inyectarlo en el HML
            document.querySelector('#menu').appendChild(menuDiv);
        })
    }catch(error){
        console.log(error);
    }
}

function seleccionarServicio(e) {
    
    let elemento;
    // Forzar que el  elemento al cual le damos click sea el DIV 
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idMenu );

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const menuObj = {
            id: parseInt( elemento.dataset.idMenu ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(menuObj);
        agregarServicio(menuObj);
    }
}

function eliminarServicio(id){
    const { menuServicio } = menu;
    menu.menuServicio = menuServicio.filter( servicio => servicio.id !== id );

    // console.log(menu);

}

function agregarServicio(menuObj){
    const { menuServicio } = menu;

    menu.menuServicio = [...menuServicio, menuObj];

    // console.log(menu);

}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina  === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarResumen(){
    const { nombre, fecha, hora, menuServicio} = menu;

    const resumenMenu = document.querySelector('.contenido-resumen');

    while(resumenMenu.firstChild){
        resumenMenu.removeChild(resumenMenu.firstChild);
    }

    if(Object.values(menu).includes('')){
        const noMenu = document.createElement('P');
        noMenu.textContent = 'Faltan datos de Menu, hora, fecha, nombre o numero de mesa';
    
        noMenu.classList.add('invalidar-cita');

        resumenMenu.appendChild(noMenu);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosMenu = document.createElement('DIV');
    serviciosMenu.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosMenu.appendChild(headingServicios);

    let cantidad = 0;

    menuServicio.forEach( servicioMenu => {

        const {nombre, precio} = servicioMenu;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt( totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosMenu.appendChild(contenedorServicio);
    });

    resumenMenu.appendChild(headingCita);
    resumenMenu.appendChild(nombreCita);
    resumenMenu.appendChild(fechaCita);
    resumenMenu.appendChild(horaCita);

    resumenMenu.appendChild(serviciosMenu);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;

    resumenMenu.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // Validación de que nombreTexto debe tener algo
        if( nombreTexto === '' || nombreTexto.length < 3 ) {
            mostrarAlerta('Nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            menu.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error');
        } else {
            menu.fecha = fechaInput.value;

            // console.log(menu);
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            menu.hora = horaCita;

            // console.log(menu);
        }
    });
}