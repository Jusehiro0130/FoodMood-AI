import type { Restaurant } from "@/lib/types";

const baseRestaurants = [
  ["papas-locas-pty","Papas Locas PTY","Salchipapas cargadas, combos rapidos y salsas de la casa para antojos fuertes.",["Salchipapa","Comida rapida"],["barato","papas","delivery","antojo"],"$",["Rapido","Amigos","Casual"],"@papaslocaspty","Via Argentina, local 12","El Cangrejo",1.4,4.7,"Lun-Dom 11:00 AM - 11:30 PM"],
  ["burger-mood","Burger Mood","Hamburguesas grandes con pan artesanal, papas crujientes y batidos.",["Hamburguesas","Comida rapida"],["burger","papas","grande","casual"],"$$",["Casual","Amigos"],"@burgermoodpty","Calle 50, plaza central","Obarrio",2.8,4.6,"Lun-Dom 12:00 PM - 10:30 PM"],
  ["trattoria-bella","Trattoria Bella","Pastas frescas, risotto y vinos sin complicarse demasiado.",["Italiana","Pizza"],["pasta","vino","romantico","bonito"],"$$",["Cita","Bonito","Tranquilo"],"@trattoriabellapty","Calle Uruguay, casa 8","Bella Vista",3.1,4.8,"Mar-Dom 12:00 PM - 11:00 PM"],
  ["sushi-norte","Sushi Norte","Rolls frescos, bowls japoneses y opciones para compartir.",["Sushi"],["rolls","japones","amigos","fresco"],"$$",["Amigos","Casual","Bonito"],"@sushinortepty","Avenida Balboa, nivel 2","Marbella",4.7,4.5,"Lun-Dom 12:00 PM - 10:00 PM"],
  ["tacos-del-barrio","Tacos del Barrio","Tacos, gringas y burritos con sabor callejero y buen picante.",["Mexicana"],["tacos","picante","burrito","casual"],"$",["Casual","Amigos","Rapido"],"@tacosdelbarriopty","Via Porras, food court","San Francisco",5.2,4.4,"Lun-Sab 11:30 AM - 10:00 PM"],
  ["antojo-panameno","Antojo Panameno","Platos panamenos caseros, hojaldres, bistec picado y arroz con pollo.",["Comida panamena"],["criollo","casero","familiar","desayuno"],"$",["Familiar","Casual"],"@antojopanamenopty","Calle 68 Este","San Francisco",2.2,4.6,"Lun-Dom 7:00 AM - 8:00 PM"],
  ["la-esquina-fast-food","La Esquina Fast Food","Hot dogs, salchipapas, emparedados y combos listos en minutos.",["Comida rapida","Salchipapa"],["rapido","barato","combo","noche"],"$",["Rapido","Casual"],"@laesquinafastpty","Transistmica, local 4","Betania",6.5,4.2,"Lun-Dom 10:00 AM - 12:00 AM"],
  ["verde-bowl","Verde Bowl","Bowls saludables, wraps, jugos naturales y proteinas ligeras.",["Saludable"],["fit","vegetariano","bowl","jugo"],"$$",["Tranquilo","Casual","Bonito"],"@verdebowlpty","Costa del Este, plaza norte","Costa del Este",8.8,4.7,"Lun-Sab 8:00 AM - 8:30 PM"],
  ["pizza-brava","Pizza Brava","Pizzas al horno, bordes crocantes y sabores para grupo.",["Pizza","Italiana"],["pizza","horno","familia","amigos"],"$$",["Amigos","Familiar","Casual"],"@pizzabravapty","El Dorado, plaza principal","El Dorado",7.4,4.3,"Lun-Dom 12:00 PM - 11:00 PM"],
  ["mariscos-del-cangrejo","Mariscos del Cangrejo","Ceviches, filetes, arroz con mariscos y platos frescos de temporada.",["Mariscos"],["ceviche","pescado","fresco","familia"],"$$$",["Familiar","Bonito","Tranquilo"],"@mariscosdelcangrejo","Via Argentina, esquina 5","El Cangrejo",1.9,4.6,"Mar-Dom 11:00 AM - 9:30 PM"],
  ["arepa-house-pty","Arepa House PTY","Arepas rellenas, cachapas y jugos tropicales para comer sin prisa.",["Comida rapida"],["arepa","queso","casual","barato"],"$",["Casual","Rapido"],"@arepahousepty","Via Espana, local 22","Via Espana",3.8,4.4,"Lun-Dom 9:00 AM - 10:00 PM"],
  ["bowl-fit-panama","Bowl Fit Panama","Poke bowls, quinoa, pollo grillado y opciones vegetarianas.",["Saludable","Sushi"],["poke","fit","vegetariano","ligero"],"$$",["Tranquilo","Rapido"],"@bowlfitpanama","Multiplaza, nivel terraza","Punta Pacifica",5.9,4.5,"Lun-Dom 10:00 AM - 9:00 PM"],
  ["ramen-urbano","Ramen Urbano","Ramen caliente, gyozas y caldos intensos para noches tranquilas.",["Ramen"],["ramen","japones","caldo","noche"],"$$",["Tranquilo","Cita","Casual"],"@ramenurbanopty","Calle 74 Este","San Francisco",2.9,4.8,"Mar-Dom 12:00 PM - 10:30 PM"],
  ["pasta-noche","Pasta Noche","Pastas cremosas, lasagna y ambiente bajo en luz para citas.",["Italiana"],["pasta","cita","bonito","vino"],"$$$",["Cita","Bonito","Tranquilo"],"@pastanochepty","Casco Antiguo, calle 9","Casco Antiguo",9.3,4.9,"Mie-Dom 5:00 PM - 12:00 AM"],
  ["wings-spot","Wings Spot","Alitas, boneless, cervezas sin alcohol y salsas picantes.",["Wings","Comida rapida"],["alitas","amigos","picante","deportes"],"$$",["Amigos","Casual"],"@wingsspotpty","Condado del Rey, plaza oeste","Condado del Rey",10.6,4.3,"Lun-Dom 12:00 PM - 11:30 PM"],
  ["dulce-mood","Dulce Mood","Postres, waffles, helados y cafe para cerrar el antojo.",["Postres"],["waffle","helado","cafe","bonito"],"$$",["Bonito","Cita","Amigos"],"@dulcemoodpty","Altaplaza, nivel 1","Centennial",11.2,4.5,"Lun-Dom 10:00 AM - 10:00 PM"],
  ["parrilla-urbana","Parrilla Urbana","Carnes, chorizos, hamburguesas de parrilla y platos para compartir.",["Hamburguesas","Comida rapida"],["parrilla","carne","amigos","familiar"],"$$",["Familiar","Amigos","Casual"],"@parrillaurbanapty","Los Pueblos, terraza 3","Juan Diaz",13.4,4.2,"Jue-Dom 12:00 PM - 11:00 PM"],
  ["el-combo-criollo","El Combo Criollo","Comida panamena rapida: pollo guisado, arroz, tajadas y sopas.",["Comida panamena","Comida rapida"],["criollo","barato","almuerzo","casero"],"$",["Rapido","Familiar"],"@combocriollopty","Avenida Peru, fonda 2","Calidonia",4.2,4.1,"Lun-Sab 7:00 AM - 5:00 PM"],
  ["burrito-club","Burrito Club","Burritos grandes, nachos y bowls mexicanos para hambre seria.",["Mexicana","Comida rapida"],["burrito","barato","rapido","picante"],"$",["Rapido","Amigos","Casual"],"@burritoclubpty","12 de Octubre, plaza local 7","12 de Octubre",6.1,4.3,"Lun-Dom 11:00 AM - 10:00 PM"],
  ["cafe-antojo","Cafe Antojo","Cafe, emparedados, postres y rincones tranquilos para conversar.",["Postres","Saludable"],["cafe","postre","tranquilo","bonito"],"$$",["Tranquilo","Bonito","Cita"],"@cafeantojopty","Clayton, plaza verde","Clayton",9.8,4.7,"Lun-Dom 8:00 AM - 8:00 PM"],
  ["sabor-chino-express","Sabor Chino Express","Arroz frito, costillitas, chow mein y combos abundantes.",["Comida rapida"],["combo","rapido","barato","arroz"],"$",["Rapido","Familiar"],"@saborchinoexpress","Tumba Muerto, local 18","Tumba Muerto",7.8,4,"Lun-Dom 10:30 AM - 9:30 PM"],
  ["crunchy-salchi","Crunchy Salchi","Salchipapas con toppings, pollo crispy y salsas dulces-picantes.",["Salchipapa","Comida rapida"],["salchipapa","barato","crispy","cerca"],"$",["Rapido","Amigos"],"@crunchysalchipty","Parque Lefevre, esquina 14","Parque Lefevre",4.9,4.5,"Lun-Dom 12:00 PM - 12:00 AM"],
  ["marea-sushi","Marea Sushi","Sushi creativo, entradas calientes y cocteles mocktail.",["Sushi","Mariscos"],["sushi","mariscos","bonito","cita"],"$$$",["Cita","Bonito","Amigos"],"@mareasushipty","Paitilla, ocean plaza","Paitilla",5.4,4.8,"Lun-Dom 12:00 PM - 11:00 PM"],
  ["masa-madre","Masa Madre","Pizza napolitana, focaccia y pastas cortas con ingredientes frescos.",["Pizza","Italiana"],["pizza","italiana","masa","cita"],"$$",["Bonito","Cita","Casual"],"@masamadrepty","Santa Maria, paseo 2","Santa Maria",12.1,4.7,"Mar-Dom 12:00 PM - 10:30 PM"],
  ["wok-verde","Wok Verde","Woks de vegetales, noodles, tofu y pollo con salsas ligeras.",["Saludable","Comida rapida"],["vegetariano","rapido","wok","saludable"],"$$",["Rapido","Tranquilo"],"@wokverdepty","Albrook Mall, pasillo koala","Albrook",8.1,4.2,"Lun-Dom 10:00 AM - 8:00 PM"]
] as const;

export const restaurants: Restaurant[] = baseRestaurants.map((item, index) => ({
  id: item[0] as string,
  name: item[1] as string,
  description: item[2] as string,
  categories: item[3] as string[],
  tags: item[4] as string[],
  priceLevel: item[5] as Restaurant["priceLevel"],
  ambience: item[6] as string[],
  instagram: item[7] as string,
  whatsapp: `+507 6000-${String(1101 + index).padStart(4, "0")}`,
  address: item[8] as string,
  zone: item[9] as string,
  distanceKm: item[10] as number,
  rating: item[11] as number,
  openingHours: item[12] as string,
}));

export function getRestaurantById(id: string) { return restaurants.find((restaurant) => restaurant.id === id); }
