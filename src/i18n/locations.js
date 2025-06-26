/**
 * Locations data for the spy game in both languages
 * Each location has a name and a list of roles or typical elements of that place
 * Locations are organized by categories
 */
export default {
  en: {
    categories: [
      {
        id: "lugares_publicos",
        name: "Public Places",
        locations: [
          {
            name: "Hospital",
            roles: ["Doctor", "Nurse", "Patient", "Surgeon", "Anesthesiologist"]
          },
          {
            name: "School",
            roles: ["Teacher", "Student", "Principal", "Janitor", "Librarian"]
          },
          {
            name: "Bank",
            roles: ["Cashier", "Customer", "Manager", "Security Guard", "Accountant"]
          },
          {
            name: "Library",
            roles: ["Librarian", "Reader", "Student", "Researcher", "Security Guard"]
          },
          {
            name: "Police Station",
            roles: ["Police Officer", "Detective", "Criminal", "Lawyer", "Victim"]
          },
          {
            name: "Fire Station",
            roles: ["Firefighter", "Fire Chief", "Dispatcher", "Victim", "Paramedic"]
          },
          {
            name: "Cemetery",
            roles: ["Drunk Gravedigger", "Vengeful Ghost", "Grave Robber", "Family Crying for Inheritance", "Dead Person Who Doesn't Want to Leave"]
          },
          {
            name: "Funeral",
            roles: ["Suspicious Widow", "Uncomfortable Lover", "Celebrating Son", "Priest Who Didn't Know the Deceased", "Friend Who Only Came for the Catering"]
          },
          {
            name: "Autopsy Room",
            roles: ["Forensic Without Gloves", "Talking Corpse", "Intern in Training", "Sleeping Doctor", "Lost Organ"]
          },
          {
            name: "Psychiatric Hospital",
            roles: ["Patient Who Claims to be Napoleon", "Doctor Who Hears Voices", "Impatient Nurse", "Mirror That Responds", "Cursed Wheelchair"]
          },
          {
            name: "Mass Grave",
            roles: ["Amateur Excavator", "Cover-up Politician", "Indignant Skeleton", "Digging Dog", "Neighbor Who 'Saw Nothing'"]
          },
          {
            name: "Abandoned Church",
            roles: ["Demonic Nun", "Renegade Priest", "Regular Possessed Person", "Ghost Bell Ringer", "Haunted Confessional"]
          },
          {
            name: "Incinerator",
            roles: ["Employee with God Complex", "Mixed Remains", "Widow in a Hurry", "Poetic Manager", "Flammable Coffin"]
          },
          {
            name: "Human Experimentation Center",
            roles: ["Mutant Patient", "Mad Scientist", "Accidental Volunteer", "Resentful Clone", "Doctor Without Morals"]
          }
        ]
      },
      {
        id: "entretenimiento",
        name: "Entertainment",
        locations: [
          {
            name: "Cinema",
            roles: ["Spectator", "Ticket Seller", "Usher", "Projectionist", "Popcorn Vendor"]
          },
          {
            name: "Casino",
            roles: ["Dealer", "Player", "Security Guard", "Bartender", "Manager"]
          },
          {
            name: "Zoo",
            roles: ["Zookeeper", "Visitor", "Veterinarian", "Tour Guide", "Photographer"]
          },
          {
            name: "Circus",
            roles: ["Clown", "Acrobat", "Tamer", "Juggler", "Spectator"]
          },
          {
            name: "Amusement Park",
            roles: ["Ride Operator", "Visitor", "Vendor", "Mascot", "Maintenance Technician"]
          }
        ]
      },
      {
        id: "transporte",
        name: "Transportation",
        locations: [
          {
            name: "Airplane",
            roles: ["Pilot", "Flight Attendant", "Passenger", "Co-pilot", "Maintenance Technician"]
          },
          {
            name: "Cruise Ship",
            roles: ["Captain", "Tourist", "Waiter", "Entertainer", "Cook"]
          },
          {
            name: "Train Station",
            roles: ["Conductor", "Passenger", "Ticket Seller", "Inspector", "Cleaner"]
          },
          {
            name: "Submarine",
            roles: ["Captain", "Sailor", "Cook", "Navigation Officer", "Engineer"]
          }
        ]
      },
      {
        id: "comercio",
        name: "Commerce",
        locations: [
          {
            name: "Restaurant",
            roles: ["Chef", "Waiter", "Customer", "Dishwasher", "Host"]
          },
          {
            name: "Supermarket",
            roles: ["Cashier", "Customer", "Manager", "Stocker", "Butcher"]
          },
          {
            name: "Hotel",
            roles: ["Receptionist", "Guest", "Bellhop", "Maid", "Manager"]
          }
        ]
      },
      {
        id: "vacaciones",
        name: "Vacation",
        locations: [
          {
            name: "Beach",
            roles: ["Surfer", "Lifeguard", "Tourist", "Street Vendor", "Swimmer"]
          },
          {
            name: "Space Station",
            roles: ["Astronaut", "Scientist", "Engineer", "Doctor", "Commander"]
          }
        ]
      }
    ]
  },
  es: {
    categories: [
      {
        id: "lugares_publicos",
        name: "Lugares Públicos",
        locations: [
          {
            name: "Hospital",
            roles: ["Doctor", "Enfermera", "Paciente", "Cirujano", "Anestesista"]
          },
          {
            name: "Escuela",
            roles: ["Profesor", "Estudiante", "Director", "Conserje", "Bibliotecario"]
          },
          {
            name: "Banco",
            roles: ["Cajero", "Cliente", "Gerente", "Guardia de seguridad", "Contador"]
          },
          {
            name: "Biblioteca",
            roles: ["Bibliotecario", "Lector", "Estudiante", "Investigador", "Guardia de seguridad"]
          },
          {
            name: "Estación de policía",
            roles: ["Policía", "Detective", "Criminal", "Abogado", "Víctima"]
          },
          {
            name: "Estación de bomberos",
            roles: ["Bombero", "Jefe de bomberos", "Despachador", "Víctima", "Paramédico"]
          },
          {
            name: "Cementerio",
            roles: ["Sepulturero borracho", "Fantasma rencoroso", "Ladrón de tumbas", "Familia llorando por la herencia", "Muerto que no quiere irse"]
          },
          {
            name: "Funeral",
            roles: ["Viuda sospechosa", "Amante incómodo", "Hijo que festeja", "Cura que no conocía al muerto", "Amigo que solo vino por el catering"]
          },
          {
            name: "Sala de autopsias",
            roles: ["Forense sin guantes", "Cadáver parlante", "Interno en prácticas", "Médico dormido", "Órgano perdido"]
          },
          {
            name: "Hospital psiquiátrico",
            roles: ["Paciente que dice ser Napoleón", "Doctor que escucha voces", "Enfermera sin paciencia", "Espejo que responde", "Silla de ruedas maldita"]
          },
          {
            name: "Fosa común",
            roles: ["Excavador aficionado", "Político encubridor", "Esqueleto indignado", "Perro desenterrador", "Vecino que 'no vio nada'"]
          },
          {
            name: "Iglesia abandonada",
            roles: ["Monja demoníaca", "Sacerdote renegado", "Poseído habitual", "Campanero fantasma", "Confesionario embrujado"]
          },
          {
            name: "Incineradora",
            roles: ["Empleado con complejo de dios", "Restos mezclados", "Viuda con prisa", "Encargado poético", "Ataúd inflamable"]
          },
          {
            name: "Centro de experimentación humana",
            roles: ["Paciente mutante", "Científico loco", "Voluntario por error", "Clon resentido", "Doctor sin moral"]
          }
        ]
      },
      {
        id: "entretenimiento",
        name: "Entretenimiento",
        locations: [
          {
            name: "Cine",
            roles: ["Espectador", "Vendedor de entradas", "Acomodador", "Proyeccionista", "Vendedor de palomitas"]
          },
          {
            name: "Casino",
            roles: ["Crupier", "Jugador", "Guardia de seguridad", "Barman", "Gerente"]
          },
          {
            name: "Zoológico",
            roles: ["Cuidador", "Visitante", "Veterinario", "Guía turístico", "Fotógrafo"]
          },
          {
            name: "Circo",
            roles: ["Payaso", "Acróbata", "Domador", "Malabarista", "Espectador"]
          },
          {
            name: "Parque de atracciones",
            roles: ["Operador de atracciones", "Visitante", "Vendedor", "Mascota", "Técnico de mantenimiento"]
          }
        ]
      },
      {
        id: "transporte",
        name: "Transporte",
        locations: [
          {
            name: "Avión",
            roles: ["Piloto", "Azafata", "Pasajero", "Copiloto", "Técnico de mantenimiento"]
          },
          {
            name: "Crucero",
            roles: ["Capitán", "Turista", "Camarero", "Animador", "Cocinero"]
          },
          {
            name: "Estación de tren",
            roles: ["Conductor", "Pasajero", "Vendedor de boletos", "Inspector", "Limpiador"]
          },
          {
            name: "Submarino",
            roles: ["Capitán", "Marinero", "Cocinero", "Oficial de navegación", "Ingeniero"]
          }
        ]
      },
      {
        id: "comercio",
        name: "Comercio",
        locations: [
          {
            name: "Restaurante",
            roles: ["Chef", "Camarero", "Cliente", "Lavavajillas", "Anfitrión"]
          },
          {
            name: "Supermercado",
            roles: ["Cajero", "Cliente", "Gerente", "Reponedor", "Carnicero"]
          },
          {
            name: "Hotel",
            roles: ["Recepcionista", "Huésped", "Botones", "Camarera", "Gerente"]
          }
        ]
      },
      {
        id: "vacaciones",
        name: "Vacaciones",
        locations: [
          {
            name: "Playa",
            roles: ["Surfista", "Salvavidas", "Turista", "Vendedor ambulante", "Nadador"]
          },
          {
            name: "Estación espacial",
            roles: ["Astronauta", "Científico", "Ingeniero", "Médico", "Comandante"]
          }
        ]
      }
    ]
  },
  
  // Helper function to get all locations in a flat array
  getAllLocations(locale) {
    return this[locale].categories.flatMap(category => category.locations);
  }
};