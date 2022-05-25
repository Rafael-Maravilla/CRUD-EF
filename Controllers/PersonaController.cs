using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TemplateCRUD.Models;

namespace TemplateCRUD.Controllers
{
    public class PersonaController : Controller
    {
        private readonly CRUDContext _contextCRUD;
        public PersonaController(CRUDContext context)
        {
            _contextCRUD = context;
        }
        public async Task<IActionResult> Index()
        {
            return View(await _contextCRUD.Personas.ToListAsync());
        }

        public async Task<IActionResult> getAllPersonas()
        {

            return Json(await _contextCRUD.Personas.ToListAsync());
            
        }

        public async Task<IActionResult> Agregar(Persona persona)
        {
            var per = new Persona()
            {
                Nombre = persona.Nombre,
                Edad = persona.Edad,
                FechaNac = persona.FechaNac,
                Estudiando = persona.Estudiando
            };
            _contextCRUD.Add(per);
            await _contextCRUD.SaveChangesAsync();

            return Json("Registro creado");
        }

        public async Task<IActionResult> Editar(Persona persona)
        {

            _contextCRUD.Entry(persona).State = EntityState.Modified;
            await _contextCRUD.SaveChangesAsync();
            return Json("Registro Actualizado");

        }

        public async Task<IActionResult> getPersona(int id)
        {
            var data = _contextCRUD.Personas.Find(id);

            return Json(data);
        }

        public IActionResult Eliminar(int id)
        {

            var data = _contextCRUD.Personas.Find(id);

            _contextCRUD.Remove(data);
            _contextCRUD.SaveChanges();

            return Json("Registro eliminado");
        }
    }
}
