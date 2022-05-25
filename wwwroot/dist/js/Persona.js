$(document).ready(function () {

    construirDataTable();
    
})

let construirDataTable = function () {
    $('#myTable').DataTable({
        "ajax": {
            "url": "Persona/getAllPersonas",
            "dataSrc": ""
        },
        "columns": [
            {"data": "id" },
            { "data": "nombre" },
            { "data": "edad" },
            { "data": "fechaNac" },
            { "data": "estudiando" },
            {
                "data": "id",
                "render": function (data, type, row, meta) {
                    return "<input type=\"button\" class=\"btn btn-primary\"  value=\"Editar\" onclick=\"getPersona('" + data + "')\" data-toggle=\"modal\" data-target=\"#modalEditar\" > " +
                        "<input type =\"button\" onclick=\"eliminar('" + data + "')\" class=\"btn btn-danger\" value=\"Eliminar\" />";
                }
            }
        ]
    });
}
/*---------------------- Zona de declaracion de variables -----------------------------  */
let btnEditar = document.getElementById("Editar");
let btnGuardar = document.getElementById("guardar");

/*---------------------- Funcionalidad mostrar data -----------------------------  */
let mostrarData = function () {
    var dataPersonas;
    fetch("Persona/getAllPersonas", {
        method: 'POST',
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            }
            else {
                return "Falla en el servidor";
            }
        })
        .then(function (data) {
            data = JSON.parse(data);
            construirDataTable(data);
            /*data = JSON.parse(data);
            console.log(data);
            let tabla = document.getElementById("renderizarData");
            for (var i = 0; i < data.length; i++) {
                tabla.innerHTML += `<tr>
                                <td>${data[i].id}</td>
                                <td>${data[i].nombre}</td>
                                <td>${data[i].edad}</td>
                                <td>${data[i].fechaNac}</td>
                                <td>${data[i].estudiando}</td>

                                </tr>`;
            }*/
        })

}

/*---------------------- Funcionalidad guardar -----------------------------  */


btnGuardar.addEventListener('click', function () {
    $('#modalAgregar').modal('hide');

    guardar(getFormGuardar());
});



/*---------------------- cargando la data a controles de formulario -----------------------------  */
let cargarData = function (data) {
    document.getElementById("idE").value = data.id;
    document.getElementById("nombreE").value = data.nombre;
    document.getElementById("edadE").value = data.edad;
    document.getElementById("fechaNacE").value = data.fechaNac;
    document.getElementById("estudianteE").checked = data.estudiando;


}

/*---------------------- Recuperacion de data de los controles de formulario -----------------------------  */
let getFormGuardar = function () {
    let nombre = document.getElementById("nombre").value;
    let edad = document.getElementById("edad").value;
    let fecha = document.getElementById("fechaNac").value;
    let estudiante = document.getElementById("estudiante").checked;

    const persona = {
        "Nombre": nombre,
        "Edad": edad,
        "FechaNac": fecha,
        "Estudiando": estudiante
    }

    return persona;
}

/*---------------------- Funcionalidad guardar envio de data al controller -----------------------------  */
let guardar = function (persona) {
    let data = new FormData();
    data.append("Nombre", persona.Nombre);
    data.append("Edad", persona.Edad);
    data.append("FechaNac", persona.FechaNac);
    data.append("Estudiando", persona.Estudiando);

    console.log(persona.Estudiando)

    fetch("Persona/Agregar", {
        method: 'POST',
        body: data
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            }
            else {
                return "Falla en el servidor";
            }
        })
        .then(function (texto) {
            Swal.fire(
                `${texto}`,
                'Haz click sobre el boton!',
                'success'
            )
        })

    construirDataTable();
}
/*---------------------- Zona de funcionalidad para editar -----------------------------  */
/*---------------------- Carga de data a modificar -----------------------------  */
let getPersona = function (id) {
    let data = new FormData();
    data.append("id", id);


    fetch("Persona/getPersona", {
        method: 'POST',
        body: data
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            }
            else {
                return "Falla en el servidor";
            }
        })
        .then(function (data) {
            console.log(data);
            cargarData(JSON.parse(data));
        })

}

/*---------------------- Funcionalidad editar enviar data al controller -----------------------------  */
let Editar = function () {
    let id = document.getElementById("idE").value;
    let nombre = document.getElementById("nombreE").value;
    let edad = document.getElementById("edadE").value;
    let fechaNac = document.getElementById("fechaNacE").value;
    let estudiando = document.getElementById("estudianteE").checked;

    let data = new FormData();
    data.append("Id", id)
    data.append("Nombre", nombre);
    data.append("Edad", edad);
    data.append("FechaNac", fechaNac);
    data.append("Estudiando", estudiando);

    fetch("Persona/Editar", {
        method: 'POST',
        body: data
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            }
            else {
                return "Falla en el servidor";
            }
        })
        .then(function (texto) {
            Swal.fire(
                `${texto}`,
                'Haz click sobre el boton!',
                'success'
            )
        })

}

btnEditar.addEventListener('click', function () {
    $('#modalEditar').modal('hide');
    Editar();
});

/*---------------------- Funcionalidad eliminar -----------------------------  */
let eliminarRegistro = function (id) {
    let data = new FormData();
    data.append("Id", id)


    fetch("Persona/Eliminar", {
        method: 'POST',
        body: data
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            }
            else {
                return "Falla en el servidor";
            }
        })
    construirDataTable();
}

let eliminar = function (id) {
    Swal.fire({
        title: '¿Esta seguro que desea eliminar este registro?',
        text: "Si lo elimina no podra recuperarlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarRegistro(id);
            Swal.fire(
                'Registro eliminado!',
                'El registro se elimino definitivamente!.',
                'success'
            )
        }
    })
}

let limpiarCajas = function () {
    document.getElementById("nombre").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("fechaNac").value = "";
    document.getElementById("estudiante").checked = false;
}