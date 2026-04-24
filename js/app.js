//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");

const gastosListado = document.querySelector("#gastos ul");



//Evnetos
eventListener();
function eventListener() {
    document.addEventListener("DOMContentLoaded", preguntarPesupuesto);

    formulario.addEventListener('submit', agregarGasto);


}


//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];//añadir gasto
        this.calcularRestante();//llamar calcular..
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

        console.log(this.gastos);
    }
}

class UI {
    insertarPresupueto(cantidad) {
        // Extraer valores destructuring
        const { presupuesto, restante } = cantidad;
        //Agregar al Html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear div
        const divMensaje = document.createElement('div');
        //Agregar clases
        divMensaje.classList.add('text-center', 'alert');
        //tipo de elerta
        if (tipo === "error") {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;
        //Agregar al html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);
        //Quitar del html
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    mostrarGastos(gastos) {

        //Elimina el html previo
        this.limpiarHtml();

        //Iterar sobre gastos
        gastos.forEach(gasto => {

            const { nombre, cantidad, id } = gasto;//destructuring

            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id);      (viejo)
            nuevoGasto.dataset.id = id;//(nuevo)


            // Agregar al html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;


            // Boton para borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
            eliminarGasto(id);
            };
            nuevoGasto.appendChild(btnBorrar);//Agregar boton

            // Agregar al html
            gastosListado.appendChild(nuevoGasto);
        });

    }

    limpiarHtml() {
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante } = presupuestoObj; 

        const restanteDiv = document.querySelector('.restante');

        //comprobar el 25%
        if((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        }else if((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
             restanteDiv.classList.remove('alert-danger', 'alert-warning');
             restanteDiv.classList.add('alert-success');
        }


        //si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta("El presupuesto de ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
   
    }
}

// Instanciar en forma global, para poder entrar de diferentes funciones
const ui = new UI();


let presupuesto;
//Funciones
function preguntarPesupuesto() {
    const presupuestoUsuario = prompt("cual es tu presupuesto");

    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();//Recarga la pagina
    }
    // Presupesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupueto(presupuesto);
}

//Añade Gasto
function agregarGasto(e) {
    e.preventDefault();//prevenimos el comportamiento del submit

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar: comprobar que no esten vacios
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no válida", 'error');
        return;
    }

    //Crear un objeto con el gasto
    //une nombre y cantidad a gasto (oviet literal).
    const gasto = { nombre, cantidad, id: Date.now() };

    //Añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje de exito
    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina del html
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}



//Notas
/*En JavaScript, Number() es una función constructora y de conversión que transforma valores (como cadenas de texto o booleanos) a su equivalente numérico. Maneja tanto enteros como decimales bajo el estándar IEEE 754 de 64 bits. Si el valor no se puede convertir, devuelve NaN (Not-a-Number). */

/*El método reset() en JavaScript, disponible en la interfaz HTMLFormElement, restablece un formulario a sus valores predeterminados, limpiando campos de entrada (input, textarea, etc.). Funciona idénticamente a un botón de type="reset" en HTML, devolviendo cada elemento a su estado inicial sin recargar la página.  */


/*En JavaScript, `className` es una propiedad que se utiliza para obtener o establecer el valor del atributo `class` de un elemento. Se llama `className` en lugar de `class` porque "class" es una palabra clave reservada en el lenguaje */

/*a propiedad dataset en JavaScript permite leer y escribir atributos de datos personalizados (data-*) en elementos HTML, devolviendo un objeto DOMStringMap. Es ideal para almacenar información oculta en el DOM (como IDs, configuraciones o estados) y acceder a ella mediante JavaScript, convirtiendo nombres guionizados en camelCase (ej. data-user-id se convierte en dataset.userId) */
