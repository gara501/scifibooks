// influences.js
// Conexiones curadas entre los 100 libros del Archivo Estelar.
// tipo: 'influencia' = linaje temático/histórico entre obras de distintos autores
//       'autor'      = misma saga, mismo autor, o continuidad editorial directa
// nota: una frase breve que explica la conexión (útil para tooltips)
//
// Uso en tu proyecto:
//   import { books } from './books'
//   import { edges } from './influences'

export const edges = [
  // --- Orígenes / Frankenstein ---
  { source: 'SF-050', target: 'SF-048', tipo: 'influencia', nota: 'La aventura tecnológica verosímil hereda el impulso creador de Frankenstein.' },
  { source: 'SF-050', target: 'SF-049', tipo: 'influencia', nota: 'La máquina como extensión del ingenio humano, ya sin el horror pero con la misma fascinación.' },
  { source: 'SF-050', target: 'SF-011', tipo: 'influencia', nota: 'El temor a fuerzas creadas o llegadas que superan el control humano.' },
  { source: 'SF-050', target: 'SF-009', tipo: 'influencia', nota: 'La creación de vida artificial y sus consecuencias éticas.' },
  { source: 'SF-050', target: 'SF-095', tipo: 'influencia', nota: 'La manipulación de la vida como dilema moral central.' },
  { source: 'SF-050', target: 'SF-098', tipo: 'influencia', nota: 'El horror ante lo que el ser humano no puede comprender ni controlar.' },

  // --- H.G. Wells ---
  { source: 'SF-011', target: 'SF-015', tipo: 'influencia', nota: 'El contacto con una inteligencia o tecnología radicalmente superior.' },
  { source: 'SF-011', target: 'SF-059', tipo: 'influencia', nota: 'Una amenaza cósmica que oscurece el cielo y desafía a la ciencia.' },
  { source: 'SF-011', target: 'SF-080', tipo: 'influencia', nota: 'La invasión sistemática por una fuerza tecnológica implacable.' },
  { source: 'SF-011', target: 'SF-074', tipo: 'influencia', nota: 'Una catástrofe ambiental que transforma la psique humana.' },
  { source: 'SF-012', target: 'SF-024', tipo: 'influencia', nota: 'Las paradojas y la mecánica narrativa del viaje en el tiempo.' },
  { source: 'SF-012', target: 'SF-043', tipo: 'influencia', nota: 'La experiencia del tiempo como algo fracturado y no lineal.' },
  { source: 'SF-012', target: 'SF-062', tipo: 'influencia', nota: 'El desplazamiento académico hacia un pasado peligroso.' },
  { source: 'SF-012', target: 'SF-028', tipo: 'influencia', nota: 'La contemplación de un futuro humano casi irreconocible.' },

  // --- Verne ---
  { source: 'SF-048', target: 'SF-018', tipo: 'influencia', nota: 'La expedición científica hacia un objeto de origen desconocido.' },
  { source: 'SF-049', target: 'SF-039', tipo: 'influencia', nota: 'La maquinaria industrial como escenario de una visión oscura de la ciudad.' },
  { source: 'SF-049', target: 'SF-065', tipo: 'influencia', nota: 'El formalismo estético de la tecnología a vapor.' },

  // --- Stapledon / cosmología ---
  { source: 'SF-097', target: 'SF-096', tipo: 'autor', nota: 'La misma progresión: de la escala humana a la escala del universo.' },
  { source: 'SF-096', target: 'SF-008', tipo: 'influencia', nota: 'El ascenso y la caída de civilizaciones como materia narrativa.' },
  { source: 'SF-096', target: 'SF-073', tipo: 'influencia', nota: 'La contemplación de mentes y civilizaciones a escala cósmica.' },
  { source: 'SF-096', target: 'SF-086', tipo: 'influencia', nota: 'Un clímax que abarca el destino final del universo.' },

  // --- Asimov / imperio galáctico ---
  { source: 'SF-008', target: 'SF-001', tipo: 'influencia', nota: 'Un imperio en decadencia que exige planificación a largo plazo.' },
  { source: 'SF-008', target: 'SF-010', tipo: 'influencia', nota: 'Estructuras imperiales, religión y profecía en la space opera.' },
  { source: 'SF-008', target: 'SF-017', tipo: 'influencia', nota: 'Civilizaciones galácticas estratificadas por su nivel tecnológico.' },
  { source: 'SF-008', target: 'SF-031', tipo: 'influencia', nota: 'Un imperio gobernado por una única conciencia expandida.' },
  { source: 'SF-008', target: 'SF-058', tipo: 'influencia', nota: 'La colonización militar como brazo de un imperio en expansión.' },
  { source: 'SF-008', target: 'SF-053', tipo: 'influencia', nota: 'Una civilización utópica que impone su visión en conflicto con otras.' },
  { source: 'SF-008', target: 'SF-003', tipo: 'influencia', nota: 'La planificación civilizacional a gran escala frente a amenazas externas.' },
  { source: 'SF-001', target: 'SF-040', tipo: 'influencia', nota: 'El planeta como fuerza ecológica y política que moldea a sus colonos.' },
  { source: 'SF-077', target: 'SF-078', tipo: 'autor', nota: 'Saga de Elijah Baley y R. Daneel Olivaw.' },
  { source: 'SF-077', target: 'SF-036', tipo: 'influencia', nota: 'El detective humano en un mundo transformado por la tecnología.' },
  { source: 'SF-077', target: 'SF-047', tipo: 'influencia', nota: 'El misterio criminal trasladado al escenario espacial.' },
  { source: 'SF-079', target: 'SF-073', tipo: 'influencia', nota: 'Física especulativa y realidades paralelas que amenazan la existencia.' },

  // --- Clarke ---
  { source: 'SF-015', target: 'SF-018', tipo: 'autor', nota: 'Contacto con una inteligencia o artefacto radicalmente incomprensible.' },
  { source: 'SF-015', target: 'SF-028', tipo: 'autor', nota: 'Un futuro trascendental donde la humanidad supera sus límites.' },
  { source: 'SF-015', target: 'SF-063', tipo: 'autor', nota: 'El siguiente paso evolutivo guiado por una inteligencia superior.' },
  { source: 'SF-015', target: 'SF-057', tipo: 'influencia', nota: 'Una inteligencia fría y no humana que cuestiona la naturaleza de la conciencia.' },
  { source: 'SF-033', target: 'SF-018', tipo: 'influencia', nota: 'El asombro ante una megaestructura artificial de escala planetaria.' },
  { source: 'SF-018', target: 'SF-027', tipo: 'influencia', nota: 'Un mensaje o artefacto alienígena que exige ser descifrado científicamente.' },
  { source: 'SF-018', target: 'SF-032', tipo: 'influencia', nota: 'Tecnología alienígena abandonada que la humanidad explota sin comprenderla del todo.' },
  { source: 'SF-018', target: 'SF-056', tipo: 'influencia', nota: 'Experimentos científicos con consecuencias evolutivas imprevistas.' },
  { source: 'SF-018', target: 'SF-026', tipo: 'influencia', nota: 'El rigor técnico aplicado a la resolución de problemas de supervivencia.' },

  // --- Contacto incomprensible ---
  { source: 'SF-059', target: 'SF-003', tipo: 'influencia', nota: 'Una amenaza detectada científicamente que exige una respuesta racional y colectiva.' },
  { source: 'SF-016', target: 'SF-035', tipo: 'influencia', nota: 'El contacto con una fuerza alienígena radicalmente incomprensible.' },
  { source: 'SF-035', target: 'SF-057', tipo: 'influencia', nota: 'Una alteridad cuya naturaleza desafía por completo la cognición humana.' },
  { source: 'SF-016', target: 'SF-090', tipo: 'influencia', nota: 'Una forma de comunicación ajena que transforma la percepción de quien la estudia.' },
  { source: 'SF-099', target: 'SF-067', tipo: 'influencia', nota: 'El contacto pacífico y casi espiritual con civilizaciones no humanas.' },
  { source: 'SF-067', target: 'SF-090', tipo: 'influencia', nota: 'La comprensión filosófica de lo radicalmente distinto.' },
  { source: 'SF-090', target: 'SF-091', tipo: 'autor', nota: 'Relatos filosóficos especulativos sobre la percepción y el tiempo.' },
  { source: 'SF-099', target: 'SF-063', tipo: 'influencia', nota: 'Especies superiores que guían -o dominan- el destino de la humanidad.' },

  // --- Distopía ---
  { source: 'SF-005', target: 'SF-004', tipo: 'influencia', nota: 'El control social mediante la ingeniería del deseo y la conducta.' },
  { source: 'SF-004', target: 'SF-006', tipo: 'influencia', nota: 'Un estado totalitario que borra la memoria y la cultura.' },
  { source: 'SF-004', target: 'SF-038', tipo: 'influencia', nota: 'La vigilancia estatal y el control del cuerpo como instrumento de poder.' },
  { source: 'SF-005', target: 'SF-095', tipo: 'influencia', nota: 'Una sociedad estratificada según criterios biológicos.' },
  { source: 'SF-004', target: 'SF-089', tipo: 'influencia', nota: 'Comunidades cerradas y vigiladas que sobreviven bajo un régimen.' },

  // --- Postapocalíptico ---
  { source: 'SF-051', target: 'SF-041', tipo: 'influencia', nota: 'El colapso repentino de la civilización tal como se conocía.' },
  { source: 'SF-041', target: 'SF-037', tipo: 'influencia', nota: 'La pregunta de qué conocimiento merece preservarse tras la catástrofe.' },
  { source: 'SF-037', target: 'SF-020', tipo: 'influencia', nota: 'El peregrinaje humano a través de un mundo reducido a cenizas.' },
  { source: 'SF-037', target: 'SF-089', tipo: 'influencia', nota: 'Refugios subterráneos donde sobreviven los fragmentos de la civilización.' },
  { source: 'SF-037', target: 'SF-066', tipo: 'influencia', nota: 'Una orden de sabios que resguarda el conocimiento frente al caos exterior.' },
  { source: 'SF-020', target: 'SF-044', tipo: 'influencia', nota: 'Un mundo desecho por catástrofes que se repiten sin tregua.' },
  { source: 'SF-051', target: 'SF-088', tipo: 'influencia', nota: 'Una plaga o colapso biológico que diezma a la humanidad.' },
  { source: 'SF-088', target: 'SF-093', tipo: 'autor', nota: 'Saga MaddAddam.' },
  { source: 'SF-088', target: 'SF-030', tipo: 'influencia', nota: 'El colapso ecológico provocado por la biotecnología corporativa.' },
  { source: 'SF-095', target: 'SF-088', tipo: 'influencia', nota: 'La ingeniería genética corporativa como antesala del colapso biotecnológico.' },
  { source: 'SF-060', target: 'SF-026', tipo: 'influencia', nota: 'La tradición de sobrevivir contra un entorno extremadamente hostil.' },

  // --- Cyberpunk ---
  { source: 'SF-009', target: 'SF-002', tipo: 'influencia', nota: 'La pregunta por la conciencia artificial en un mundo dominado por corporaciones.' },
  { source: 'SF-002', target: 'SF-064', tipo: 'autor', nota: 'Trilogía del Sprawl.' },
  { source: 'SF-002', target: 'SF-013', tipo: 'influencia', nota: 'El ciberespacio como escenario narrativo central.' },
  { source: 'SF-002', target: 'SF-036', tipo: 'influencia', nota: 'Mentes digitalizadas y cuerpos intercambiables.' },
  { source: 'SF-013', target: 'SF-045', tipo: 'autor', nota: 'Sistemas de información, redes y criptografía como materia narrativa.' },
  { source: 'SF-013', target: 'SF-046', tipo: 'autor', nota: 'Nanotecnología y sociedades fragmentadas en tribus culturales.' },
  { source: 'SF-002', target: 'SF-065', tipo: 'autor', nota: 'El giro hacia un pasado retrofuturista sin abandonar la especulación tecnológica.' },
  { source: 'SF-036', target: 'SF-047', tipo: 'influencia', nota: 'El detective en una sociedad tecnológicamente estratificada.' },
  { source: 'SF-061', target: 'SF-002', tipo: 'influencia', nota: 'Una realidad simulada o ilusoria como prisión perceptiva.' },
  { source: 'SF-061', target: 'SF-092', tipo: 'influencia', nota: 'Realidades artificiales que atrapan a quienes las habitan.' },

  // --- Ucronía / Steampunk ---
  { source: 'SF-019', target: 'SF-065', tipo: 'influencia', nota: 'La historia alternativa como herramienta narrativa formal.' },
  { source: 'SF-065', target: 'SF-039', tipo: 'influencia', nota: 'Un mundo industrial alternativo saturado de biotecnología urbana.' },

  // --- New Wave ---
  { source: 'SF-074', target: 'SF-075', tipo: 'autor', nota: 'El colapso social dentro de espacios cerrados y controlados.' },
  { source: 'SF-043', target: 'SF-042', tipo: 'autor', nota: 'La sátira de la condición humana a través de la especulación cósmica.' },
  { source: 'SF-070', target: 'SF-071', tipo: 'autor', nota: 'La exploración radical del lenguaje como forma de percepción.' },
  { source: 'SF-007', target: 'SF-070', tipo: 'influencia', nota: 'El lenguaje y la identidad como territorio de especulación radical.' },

  // --- Le Guin ---
  { source: 'SF-007', target: 'SF-025', tipo: 'autor', nota: 'Sociedades alternativas exploradas con mirada antropológica.' },
  { source: 'SF-025', target: 'SF-052', tipo: 'autor', nota: 'La crítica anticolonial a través de mundos alienígenas.' },
  { source: 'SF-007', target: 'SF-044', tipo: 'influencia', nota: 'Categorías fijas de identidad y poder puestas en cuestión.' },
  { source: 'SF-007', target: 'SF-031', tipo: 'influencia', nota: 'El género y la identidad cuestionados en sociedades no humanas.' },
  { source: 'SF-025', target: 'SF-085', tipo: 'influencia', nota: 'Utopías imperfectas pero genuinamente esperanzadoras.' },
  { source: 'SF-022', target: 'SF-007', tipo: 'influencia', nota: 'Una mirada externa que desafía las categorías humanas de sexualidad y sociedad.' },

  // --- Militar ---
  { source: 'SF-021', target: 'SF-014', tipo: 'influencia', nota: 'El entrenamiento de jóvenes para liderar una guerra interestelar.' },
  { source: 'SF-021', target: 'SF-034', tipo: 'influencia', nota: 'Una crítica al servicio militar disfrazada de aventura de combate.' },
  { source: 'SF-021', target: 'SF-058', tipo: 'influencia', nota: 'Cuerpos regenerados o transferidos para servir en la guerra.' },
  { source: 'SF-034', target: 'SF-047', tipo: 'influencia', nota: 'Veteranos de guerra en un sistema solar políticamente fracturado.' },
  { source: 'SF-058', target: 'SF-068', tipo: 'influencia', nota: 'La transferencia de identidad y el compromiso militar en sociedades coloniales.' },

  // --- Sagas de space opera ---
  { source: 'SF-068', target: 'SF-069', tipo: 'autor', nota: 'Saga Vorkosigan.' },
  { source: 'SF-069', target: 'SF-094', tipo: 'autor', nota: 'Saga Vorkosigan.' },
  { source: 'SF-053', target: 'SF-054', tipo: 'autor', nota: 'Saga de La Cultura.' },

  // --- New Weird / horror cósmico ---
  { source: 'SF-055', target: 'SF-039', tipo: 'influencia', nota: 'Mundos decadentes donde la tecnología olvidada se confunde con la magia.' },
  { source: 'SF-039', target: 'SF-029', tipo: 'influencia', nota: 'El horror biológico en zonas alienadas del mundo conocido.' },
  { source: 'SF-098', target: 'SF-029', tipo: 'influencia', nota: 'El horror cósmico ante fuerzas biológicas que exceden la comprensión.' },
  { source: 'SF-083', target: 'SF-055', tipo: 'influencia', nota: 'La mitología de un futuro lejano y decadente.' },
  { source: 'SF-076', target: 'SF-055', tipo: 'influencia', nota: 'Crónicas de un futuro remoto narradas casi como leyenda.' },
  { source: 'SF-092', target: 'SF-029', tipo: 'influencia', nota: 'Espacios que desafían la geometría y la cordura de quien los habita.' },
  { source: 'SF-098', target: 'SF-092', tipo: 'influencia', nota: 'Una arquitectura o espacio imposible como fuente de terror.' },

  // --- Hard SF contemporánea ---
  { source: 'SF-059', target: 'SF-087', tipo: 'influencia', nota: 'Una amenaza alienígena que exige estrategias radicales de supervivencia.' },
  { source: 'SF-087', target: 'SF-086', tipo: 'autor', nota: 'Trilogía de Los tres cuerpos.' },
  { source: 'SF-003', target: 'SF-087', tipo: 'autor', nota: 'Trilogía de Los tres cuerpos.' },
  { source: 'SF-057', target: 'SF-056', tipo: 'influencia', nota: 'Biología especulativa radical sobre la evolución de la mente.' },
  { source: 'SF-072', target: 'SF-073', tipo: 'autor', nota: 'La exploración de la mente posthumana.' },
  { source: 'SF-073', target: 'SF-086', tipo: 'influencia', nota: 'Mentes digitales y cosmología especulativa a escala final.' },
  { source: 'SF-023', target: 'SF-040', tipo: 'influencia', nota: 'La colonización de Marte como escenario de transformación humana.' },
  { source: 'SF-040', target: 'SF-026', tipo: 'influencia', nota: 'La supervivencia científica y la terraformación como narrativa central.' },
  { source: 'SF-084', target: 'SF-056', tipo: 'influencia', nota: 'Una especulación evolutiva que desplaza a la humanidad de su posición dominante.' },

  // --- Sátira ---
  { source: 'SF-043', target: 'SF-081', tipo: 'influencia', nota: 'El humor absurdista aplicado a la escala cósmica.' },
  { source: 'SF-081', target: 'SF-082', tipo: 'autor', nota: 'Saga de la Guía del autoestopista galáctico.' },
  { source: 'SF-081', target: 'SF-100', tipo: 'influencia', nota: 'El humor que cruza la frontera entre ciencia ficción y fantasía.' },

  // --- Viajes en el tiempo (paradojas) ---
  { source: 'SF-024', target: 'SF-062', tipo: 'influencia', nota: 'El viaje en el tiempo con consecuencias académicas y burocráticas.' },
  { source: 'SF-043', target: 'SF-062', tipo: 'influencia', nota: 'La fragmentación temporal de la experiencia individual.' },
]
