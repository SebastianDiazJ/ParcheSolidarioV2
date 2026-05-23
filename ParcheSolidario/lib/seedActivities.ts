import { ActivitiesService, CreateActivityData } from "@/modules/infraestructura/firebase/ActivitiesService"

const SEED_ACTIVITIES: Omit<CreateActivityData, "createdBy">[] = [
  // ─── EVENTOS ───────────────────────────────────────────────────────────────
  {
    title: "Festival Comunitario El Poblado",
    description:
      "Gran festival de integración con música en vivo, exposiciones de arte local y gastronomía típica antioqueña. Todos los vecinos y visitantes son bienvenidos.",
    category: "eventos",
    latitude: 6.2076,
    longitude: -75.568,
    participants: 320,
    capacity: 500,
    date: "2026-06-15",
    time: "10:00",
    location: "Parque El Poblado, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Concierto Benéfico Laureles",
    description:
      "Concierto de bandas locales para recaudar fondos destinados a la restauración del parque del barrio. Entrada libre con donación voluntaria de alimentos.",
    category: "eventos",
    latitude: 6.2519,
    longitude: -75.5957,
    participants: 180,
    capacity: 300,
    date: "2026-06-22",
    time: "16:00",
    location: "Parque Laureles, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Feria del Trueque – Centro",
    description:
      "Espacio de economía solidaria donde los ciudadanos intercambian ropa, libros, herramientas y artículos del hogar sin usar dinero. ¡Trae lo que ya no usas!",
    category: "eventos",
    latitude: 6.2529,
    longitude: -75.566,
    participants: 95,
    capacity: 200,
    date: "2026-06-08",
    time: "08:00",
    location: "Plaza de Cisneros, Medellín",
    fundraisingGoal: "",
    status: "active",
  },
  {
    title: "Torneo de Fútbol Barrial Belén",
    description:
      "Torneo interfamilias con equipos del barrio para promover el deporte y la convivencia. Premiación para los tres primeros lugares y refrigerio para todos los participantes.",
    category: "eventos",
    latitude: 6.2238,
    longitude: -75.6097,
    participants: 112,
    capacity: 150,
    date: "2026-07-05",
    time: "07:00",
    location: "Cancha Belén Los Alpes, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Cine al Aire Libre – Aranjuez",
    description:
      "Proyección de películas colombianas bajo las estrellas. Entrada gratuita, traer silla o cobija. Habrá venta de comidas típicas a bajo costo.",
    category: "eventos",
    latitude: 6.2714,
    longitude: -75.5574,
    participants: 75,
    capacity: 200,
    date: "2026-06-28",
    time: "19:00",
    location: "Parque Aranjuez, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },

  // ─── COLECTAS ───────────────────────────────────────────────────────────────
  {
    title: "Colecta de Ropa de Invierno – Bello",
    description:
      "Recolección de ropa abrigada en buen estado para familias vulnerables de la zona norte. Se aceptan chaquetas, cobijas, medias y ropa interior nueva.",
    category: "colectas",
    latitude: 6.3357,
    longitude: -75.5567,
    participants: 48,
    capacity: 100,
    date: "2026-06-10",
    time: "09:00",
    location: "Parroquia San Pedro, Bello",
    fundraisingGoal: "200 prendas",
    status: "active",
  },
  {
    title: "Recolección de Alimentos – Manrique",
    description:
      "Campaña de recolección de alimentos no perecederos para el banco de alimentos del barrio. Se reciben granos, enlatados, aceites y harinas.",
    category: "colectas",
    latitude: 6.2651,
    longitude: -75.5624,
    participants: 63,
    capacity: 120,
    date: "2026-06-12",
    time: "08:00",
    location: "Junta de Acción Comunal Manrique Central, Medellín",
    fundraisingGoal: "500 kg de alimentos",
    status: "active",
  },
  {
    title: "Campaña de Útiles Escolares – Castilla",
    description:
      "Donación de útiles escolares para niños de familias de bajos recursos que ingresan al nuevo año lectivo. Se necesitan cuadernos, lápices, colores y mochilas.",
    category: "colectas",
    latitude: 6.2878,
    longitude: -75.5762,
    participants: 34,
    capacity: 80,
    date: "2026-07-20",
    time: "10:00",
    location: "Colegio Marco Fidel Suárez, Medellín",
    fundraisingGoal: "300 kits escolares",
    status: "upcoming",
  },
  {
    title: "Colecta de Medicamentos – Itagüí",
    description:
      "Recolección de medicamentos sin vencer y en buen estado para adultos mayores sin acceso al sistema de salud. Medicamentos controlados no son aceptados.",
    category: "colectas",
    latitude: 6.1846,
    longitude: -75.5994,
    participants: 27,
    capacity: 60,
    date: "2026-06-18",
    time: "09:00",
    location: "Hospital del Sur, Itagüí",
    fundraisingGoal: "150 cajas de medicamentos",
    status: "active",
  },
  {
    title: "Campaña de Juguetes – Navidad Envigado",
    description:
      "Recolección anticipada de juguetes nuevos o en muy buen estado para niños de 0 a 12 años en situación de vulnerabilidad. Entrega en diciembre.",
    category: "colectas",
    latitude: 6.1715,
    longitude: -75.5879,
    participants: 89,
    capacity: 200,
    date: "2026-06-25",
    time: "10:00",
    location: "Alcaldía de Envigado, Envigado",
    fundraisingGoal: "400 juguetes",
    status: "upcoming",
  },

  // ─── REFUGIOS ───────────────────────────────────────────────────────────────
  {
    title: "Refugio Nocturno Centro – La Candelaria",
    description:
      "Albergue temporal para personas en situación de calle. Brinda cena, cama y desayuno. Capacidad para 50 personas cada noche. Operación permanente.",
    category: "refugios",
    latitude: 6.2442,
    longitude: -75.5812,
    participants: 50,
    capacity: 50,
    date: "2026-06-01",
    time: "18:00",
    location: "Calle 44 # 52-165, La Candelaria, Medellín",
    fundraisingGoal: "",
    status: "active",
  },
  {
    title: "Casa de Paso para Migrantes – Robledo",
    description:
      "Espacio temporal para familias migrantes en tránsito o recién llegadas. Ofrece alojamiento, orientación jurídica y acceso a servicios básicos de salud.",
    category: "refugios",
    latitude: 6.2783,
    longitude: -75.6028,
    participants: 32,
    capacity: 45,
    date: "2026-06-01",
    time: "00:00",
    location: "Barrio Robledo, Medellín",
    fundraisingGoal: "",
    status: "active",
  },
  {
    title: "Albergue para Adultos Mayores – Doce de Octubre",
    description:
      "Centro de día y pernoctación para adultos mayores solos o en situación de abandono. Ofrece alimentación, actividades recreativas y atención básica en salud.",
    category: "refugios",
    latitude: 6.2961,
    longitude: -75.5737,
    participants: 28,
    capacity: 40,
    date: "2026-06-01",
    time: "07:00",
    location: "Barrio Doce de Octubre, Medellín",
    fundraisingGoal: "",
    status: "active",
  },
  {
    title: "Refugio Familiar Temporal – Guayabal",
    description:
      "Albergue para familias desplazadas por violencia o desastres naturales. Cuenta con habitaciones familiares, cocina comunitaria y apoyo psicosocial.",
    category: "refugios",
    latitude: 6.2037,
    longitude: -75.5945,
    participants: 18,
    capacity: 30,
    date: "2026-06-01",
    time: "00:00",
    location: "Barrio Guayabal, Medellín",
    fundraisingGoal: "",
    status: "active",
  },
  {
    title: "Casa Abrigo Mujeres – San Javier",
    description:
      "Refugio seguro para mujeres víctimas de violencia intrafamiliar. Ofrece alojamiento confidencial, asesoría legal, acompañamiento psicológico y talleres de emprendimiento.",
    category: "refugios",
    latitude: 6.243,
    longitude: -75.6155,
    participants: 15,
    capacity: 20,
    date: "2026-06-01",
    time: "00:00",
    location: "Barrio San Javier, Medellín",
    fundraisingGoal: "",
    status: "active",
  },

  // ─── PROTESTAS ──────────────────────────────────────────────────────────────
  {
    title: "Marcha por la Paz – Parque Berrío",
    description:
      "Movilización ciudadana exigiendo garantías de seguridad y no repetición de hechos violentos en las comunas. Convocada por organizaciones de víctimas y juntas comunales.",
    category: "protestas",
    latitude: 6.2548,
    longitude: -75.566,
    participants: 540,
    capacity: 1000,
    date: "2026-06-20",
    time: "10:00",
    location: "Parque Berrío, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Plantón por la Educación Pública",
    description:
      "Concentración pacífica de estudiantes, docentes y padres de familia para exigir mayor inversión en infraestructura escolar y aumento del presupuesto educativo municipal.",
    category: "protestas",
    latitude: 6.2609,
    longitude: -75.5786,
    participants: 230,
    capacity: 500,
    date: "2026-06-17",
    time: "09:00",
    location: "Universidad de Antioquia, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Movilización por el Medio Ambiente",
    description:
      "Marcha ecologista contra la tala de árboles en zonas verdes urbanas y la contaminación del río Medellín. Organizada por colectivos ambientales de la ciudad.",
    category: "protestas",
    latitude: 6.2567,
    longitude: -75.5875,
    participants: 310,
    capacity: 600,
    date: "2026-06-14",
    time: "08:00",
    location: "Estadio Atanasio Girardot, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Marcha por la Seguridad Barrial – Manrique",
    description:
      "Movilización de residentes de Manrique exigiendo más presencia policial, iluminación de calles oscuras y recuperación de espacios públicos tomados por el microtráfico.",
    category: "protestas",
    latitude: 6.27,
    longitude: -75.552,
    participants: 175,
    capacity: 300,
    date: "2026-06-21",
    time: "15:00",
    location: "Parque Principal Manrique, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
  {
    title: "Concentración por Derechos Laborales",
    description:
      "Acto político-sindical exigiendo el respeto a los derechos de los trabajadores informales, vendedores ambulantes y trabajadoras domésticas de la ciudad.",
    category: "protestas",
    latitude: 6.2493,
    longitude: -75.5706,
    participants: 420,
    capacity: 800,
    date: "2026-06-28",
    time: "11:00",
    location: "Plaza de Cisneros, Medellín",
    fundraisingGoal: "",
    status: "upcoming",
  },
]

export async function seedActivities(userId: string): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = []
  let created = 0

  for (const activity of SEED_ACTIVITIES) {
    try {
      await ActivitiesService.createActivity({ ...activity, createdBy: userId })
      created++
    } catch (err) {
      errors.push(`${activity.title}: ${err instanceof Error ? err.message : "error desconocido"}`)
    }
  }

  return { created, errors }
}
