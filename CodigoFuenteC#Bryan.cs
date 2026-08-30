using System;
//Por si existe algun conflicto para abrir los archivos  el framework que ocupe es .NET 10
class Program
{
    public class Contacto
    {
        public string Nombre { get; set; }
        public string Telefono { get; set; }

        public Contacto(string nombre, string telefono)
        {
            Nombre = nombre;
            Telefono = telefono;
        }
    }

    static Contacto[] agenda = new Contacto[10];

    static void Main(string[] args)
    {
        Console.WriteLine("-----------------Bienvenido a tu Agenda Virtual---------------------------------");

        int flagUI = 0;

        do
        {
            Console.WriteLine("Presiona los botones para realizar acciones\n");
            Console.WriteLine("1. Añadir contacto");
            Console.WriteLine("2. Buscar contacto");
            Console.WriteLine("3. Modificar contacto");
            Console.WriteLine("4. Eliminar contacto");

            Console.WriteLine("5. Mostrar contacto");
            Console.WriteLine("6. Vaciar agenda");
            Console.WriteLine("7. Salir del programa\n");

            flagUI = leerEntero("Opción elegida: ", 1, 7);

            Console.Clear();

            switch (flagUI)
            {
                case 1:
                    agregarContacto();
                    break;

                case 2:
                    buscarContacto();
                    break;


                case 3:
                    modificarContacto();
                    break;


                case 4:

                    eliminarContacto();
                    break;

                case 5:
                    renderizarContactos();
                    break;

                case 6:
                    vaciarContacto();
                    break;

                case 7:
                    Console.WriteLine("Gracias por utilizar Agenda Virtual.");
                    break;
            }

            if (flagUI != 7)
            {
                Console.WriteLine("\nPresione cualquier tecla para volver al menú...");
                Console.ReadKey();

                Console.Clear();
            }

        } while (flagUI != 7);
    }

    //FUNCIONES CRUD

    static void agregarContacto()
    {
        Console.WriteLine("-----------------Agenda Virtual > Añadir Contacto---------------------------------\n");

        int espacioLibre = posicionAgendaLibre();

        if (espacioLibre == -1)
        {
            Console.WriteLine("La agenda está llena. No es posible agregar más contactos.");
            return;
        }

        string nombre = leerTexto("Digite el nombre del contacto a añadir: ");

        if (existeContacto(nombre))
        {
            Console.WriteLine("1. Cambiar el nombre.");
            Console.WriteLine("2. Continuar con el mismo nombre.");
            Console.WriteLine("Nota: No peudes agregar contactos duplicados.");

            int opcion = leerEntero("Seleccione una opción: ", 1, 2);

            if (opcion == 1)
            {
                nombre = leerTexto("Digite el nuevo nombre del contacto: ");
            }
        }

        string telefono = leerTexto($"Digite el teléfono del contacto {nombre}: ");

        // Validar duplicado exacto: mismo nombre y mismo teléfono.
        foreach (Contacto contacto in agenda)
        {
            if (contacto != null &&
                contacto.Nombre.Equals(nombre, StringComparison.OrdinalIgnoreCase) &&
                contacto.Telefono == telefono)
            {
                Console.WriteLine("\nNo puedes registrar contactos duplicados.");
                return;
            }
        }

        agenda[espacioLibre] = new Contacto(nombre, telefono);

        Console.WriteLine($"Contacto \"{nombre}\" agregado correctamente.");
    }


    static void buscarContacto()
    {
        Console.WriteLine("-----------------Agenda Virtual > Buscar Contacto---------------------------------\n");

        string nombre = leerTexto("Nombre del contacto: ");

        int contador = 0;

        foreach (Contacto contacto in agenda)
        {
            if (contacto == null) continue;

            if (contacto.Nombre.Equals(nombre, StringComparison.OrdinalIgnoreCase))
            {
                contador++;
                Console.WriteLine($"{contador}. Nombre: {contacto.Nombre}. Teléfono: {contacto.Telefono}");
            }
        }

        if (contador == 0)
        {
            Console.WriteLine($"No existe ningún contacto con el nombre \"{nombre}\".");
        }
        else
        {
            Console.WriteLine($"\nSe encontraron {contador} contacto(s).");
        }
    }



    static void modificarContacto()
    {
        Console.WriteLine("-----------------Agenda Virtual > Modificar Contacto---------------------------------\n");

        if (agendaVacia())
        {
            Console.WriteLine("La agenda está vacía.");
            return;
        }

        Console.WriteLine("Seleccione el contacto a modificar presionando su número de índice:\n");

        renderizarContactos();

        int indice = leerEntero("Índice: ", 1, agenda.Length) - 1;

        if (agenda[indice] == null)
        {
            Console.WriteLine("No existe un contacto en esa posición.");
            return;
        }

        Contacto contacSelec = agenda[indice];

        Console.WriteLine($"\nContacto seleccionado: {contacSelec.Nombre}. Teléfono: {contacSelec.Telefono}\n");

        Console.WriteLine("Seleccione qué desea modificar:");
        Console.WriteLine("1. Nombre");
        Console.WriteLine("2. Teléfono");


        int opcion = leerEntero("Opción: ", 1, 2);

        switch (opcion)
        {
            case 1:
                contacSelec.Nombre = leerTexto("Nuevo nombre: ");
                break;

            case 2:
                contacSelec.Telefono = leerTexto("Nuevo teléfono: ");
                break;
        }

        agenda[indice] = contacSelec;

        Console.WriteLine("Contacto modificado correctamente.");
    }

 

    static void eliminarContacto()
    {
        Console.WriteLine("-----------------Agenda Virtual > Eliminar Contacto---------------------------------\n");

        if (agendaVacia())
        {

            Console.WriteLine("La agenda está vacía.");
            return;
        }

        Console.WriteLine("Seleccione el contacto a eliminar presionando su número de índice:\n");

        renderizarContactos();

        int indice = leerEntero("Índice: ", 1, agenda.Length) - 1;

        if (agenda[indice] == null)
        {
            Console.WriteLine("No existe un contacto en esa posición.");
            return;
        }



        Contacto eliminado = agenda[indice];

        agenda[indice] = null;

        Console.WriteLine($"Contacto \"{eliminado.Nombre}\" eliminado correctamente.");
    }


    static void vaciarContacto()
    {
        Console.WriteLine("-----------------Agenda Virtual > Vaciar Agenda---------------------------------\n");

        if (agendaVacia())
        {
            Console.WriteLine("La agenda ya está vacía.");
            return;

        }

        Console.WriteLine("¿Está seguro de vaciar su agenda? Esta acción no se puede deshacer.");
        Console.WriteLine("1. Sí");
        Console.WriteLine("2. No");


        int opcion = leerEntero("Opción: ", 1, 2);


        if (opcion == 2)
        {
            Console.WriteLine("Operación cancelada. La agenda no fue modificada.");

            return;
        }

        for (int i = 0; i < agenda.Length; i++)
        {
            agenda[i] = null;
        }

        Console.WriteLine("Agenda vaciada correctamente.");
    }

    //METODOS AUXILIARES / REUTILIZABLES

    static void renderizarContactos()
    {
        int contador = 0;


        foreach (Contacto contacto in agenda)
        {
            if (contacto == null) continue;

            contador++;
            Console.WriteLine($"{contador}. Nombre: {contacto.Nombre}. Teléfono: {contacto.Telefono}");
        }

        if (contador == 0)
        {


            Console.WriteLine("La agenda no contiene contactos.");
        }
    }

    static bool existeContacto(string parametro)
    {
        for (int i = 0; i < agenda.Length; i++)
        {
            if (agenda[i] != null &&
                (agenda[i].Nombre.Equals(parametro, StringComparison.OrdinalIgnoreCase)
                || agenda[i].Telefono == parametro))
            {
                Console.WriteLine($"El contacto \"{parametro}\" ya existe en la agenda con teléfono: {agenda[i].Telefono}");
                return true;
            }
        }

        return false;
    }

    static int posicionAgendaLibre()
    {
        for (int i = 0; i < agenda.Length; i++)
        {
            if (agenda[i] == null)
            {
                return i;
            }
        }

        return -1;
    }

    static bool agendaVacia()
    {
        return posicionAgendaLibre() == 0;
    }
    //FUNCIONES PARA VALIDAR ENTRADA DE INPUTS


    static int leerEntero(string mensaje, int minimo, int maximo)
    {
        int numero = 0;
        bool inValido;

        do
        {
            Console.Write(mensaje);

            inValido = !int.TryParse(Console.ReadLine(), out numero);

            if (inValido)
            {
                Console.WriteLine("Entrada inválida. Debe ingresar un número.");
                continue;
            }

            if (numero < minimo || numero > maximo)
            {
                Console.WriteLine($"Ingrese un número entre {minimo} y {maximo}.");
                inValido = true;
            }

        } while (inValido);

        return numero;
    }

    static string leerTexto(string mensaje)
    {
        string texto;
        bool inValido;

        do
        {
            Console.Write(mensaje);

            texto = Console.ReadLine()?.Trim();
            inValido = string.IsNullOrWhiteSpace(texto);

            if (inValido)
            {
                Console.WriteLine("Este campo no puede quedar vacío.");
            }

        } while (inValido);

        return texto;
    }
}