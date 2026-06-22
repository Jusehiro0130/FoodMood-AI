-- =========================================================
-- Base de datos inicial de restaurantes de Panamá (incluye sesión de salchipapas)
-- PostgreSQL / Supabase / Neon / Vercel Postgres compatible
-- =========================================================
-- Nota importante:
-- - No se incluyen teléfonos, correos, coordenadas exactas ni imágenes si no están verificados.
-- - Los campos desconocidos quedan en NULL.
-- - Los ratings son aproximados para la semilla inicial; valida antes de producción.
-- =========================================================

-- =========================
-- 1. Función updated_at
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 2. Tablas principales
-- =========================
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  descripcion TEXT,
  tipo_cocina VARCHAR(100),
  rango_precio VARCHAR(4) CHECK (rango_precio IN ('$','$$','$$$','$$$$')),
  provincia VARCHAR(100) NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  corregimiento VARCHAR(100),
  direccion TEXT,
  telefono VARCHAR(30),
  whatsapp VARCHAR(30),
  instagram VARCHAR(100),
  sitio_web VARCHAR(200),
  latitud DECIMAL(9,6),
  longitud DECIMAL(9,6),
  horario TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  cantidad_resenas INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_resenas >= 0),
  imagen_url VARCHAR(300),
  delivery BOOLEAN,
  reservas BOOLEAN,
  parking BOOLEAN,
  pet_friendly BOOLEAN,
  wifi BOOLEAN,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurante_categorias (
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (restaurante_id, categoria_id)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resenas (
  id SERIAL PRIMARY KEY,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comentario TEXT,
  aprobada BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurante_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, restaurante_id)
);

CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  apertura TIME,
  cierre TIME,
  cerrado BOOLEAN NOT NULL DEFAULT FALSE,
  nota TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurante_id, dia_semana)
);

CREATE TABLE IF NOT EXISTS imagenes_restaurante (
  id SERIAL PRIMARY KEY,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  url VARCHAR(300) NOT NULL,
  descripcion TEXT,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(8,2) CHECK (precio >= 0),
  tipo VARCHAR(50),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sugerencias_restaurante (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  provincia VARCHAR(100),
  distrito VARCHAR(100),
  corregimiento VARCHAR(100),
  direccion TEXT,
  instagram VARCHAR(100),
  sitio_web VARCHAR(200),
  sugerido_por_usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','rechazado')),
  notas_moderacion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- 3. Triggers updated_at
-- =========================
DROP TRIGGER IF EXISTS trg_categorias_updated_at ON categorias;
CREATE TRIGGER trg_categorias_updated_at
BEFORE UPDATE ON categorias
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_restaurantes_updated_at ON restaurantes;
CREATE TRIGGER trg_restaurantes_updated_at
BEFORE UPDATE ON restaurantes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_resenas_updated_at ON resenas;
CREATE TRIGGER trg_resenas_updated_at
BEFORE UPDATE ON resenas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_horarios_updated_at ON horarios;
CREATE TRIGGER trg_horarios_updated_at
BEFORE UPDATE ON horarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_menus_updated_at ON menus;
CREATE TRIGGER trg_menus_updated_at
BEFORE UPDATE ON menus
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sugerencias_restaurante_updated_at ON sugerencias_restaurante;
CREATE TRIGGER trg_sugerencias_restaurante_updated_at
BEFORE UPDATE ON sugerencias_restaurante
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- 4. Índices
-- =========================
CREATE INDEX IF NOT EXISTS idx_restaurantes_activo ON restaurantes(activo);
CREATE INDEX IF NOT EXISTS idx_restaurantes_nombre ON restaurantes(nombre);
CREATE INDEX IF NOT EXISTS idx_restaurantes_slug ON restaurantes(slug);
CREATE INDEX IF NOT EXISTS idx_restaurantes_provincia ON restaurantes(provincia);
CREATE INDEX IF NOT EXISTS idx_restaurantes_distrito ON restaurantes(distrito);
CREATE INDEX IF NOT EXISTS idx_restaurantes_corregimiento ON restaurantes(corregimiento);
CREATE INDEX IF NOT EXISTS idx_restaurantes_rango_precio ON restaurantes(rango_precio);
CREATE INDEX IF NOT EXISTS idx_restaurantes_rating ON restaurantes(rating);
CREATE INDEX IF NOT EXISTS idx_restaurantes_delivery ON restaurantes(delivery);
CREATE INDEX IF NOT EXISTS idx_restaurantes_pet_friendly ON restaurantes(pet_friendly);
CREATE INDEX IF NOT EXISTS idx_restaurantes_lat_lng ON restaurantes(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_resenas_restaurante_id ON resenas(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_restaurantes_busqueda_texto
ON restaurantes USING GIN (
  to_tsvector('spanish', coalesce(nombre,'') || ' ' || coalesce(descripcion,'') || ' ' || coalesce(tipo_cocina,''))
);

-- =========================
-- 5. Categorías iniciales (incluye Salchipapas)
-- =========================
INSERT INTO categorias (nombre, slug, descripcion) VALUES
  ('Comida panameña', 'comida-panamena', 'Cocina tradicional de Panamá'),
  ('Internacional', 'internacional', 'Cocina internacional variada'),
  ('Italiana', 'italiana', 'Pasta, pizza y especialidades italianas'),
  ('Japonesa', 'japonesa', 'Cocina japonesa en general'),
  ('Sushi', 'sushi', 'Restaurantes especializados en sushi'),
  ('Hamburguesas', 'hamburguesas', 'Hamburguesas artesanales y rápidas'),
  ('Pizza', 'pizza', 'Pizzerías y variantes'),
  ('Mariscos', 'mariscos', 'Restaurantes con énfasis en mariscos'),
  ('Café', 'cafe', 'Cafeterías y coffee shops'),
  ('Postres', 'postres', 'Lugares especializados en postres'),
  ('Carnes', 'carnes', 'Parrillas y steakhouse'),
  ('Mexicana', 'mexicana', 'Cocina mexicana'),
  ('China', 'china', 'Cocina china'),
  ('Vegetariana', 'vegetariana', 'Opción vegetariana o vegana'),
  ('Bar', 'bar', 'Bares y coctelerías'),
  ('Rooftop', 'rooftop', 'Restaurantes con terraza o rooftop'),
  ('Afroantillana', 'afroantillana', 'Cocina afroantillana y afro-panameña'),
  ('Peruana', 'peruana', 'Cocina peruana y fusión nikkei'),
  ('Saludable', 'saludable', 'Platos saludables y orgánicos'),
  ('Desayunos', 'desayunos', 'Lugares de desayunos y brunch'),
  ('Salchipapas', 'salchipapas', 'Restaurantes especializados en salchipapas o que ofrecen este plato')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- =========================
-- 6. Restaurantes iniciales
-- =========================
INSERT INTO restaurantes (
  nombre, slug, descripcion, tipo_cocina, rango_precio, provincia, distrito, corregimiento,
  direccion, telefono, whatsapp, instagram, sitio_web, latitud, longitud, horario,
  rating, cantidad_resenas, imagen_url, delivery, reservas, parking, pet_friendly, wifi, activo
) VALUES
  -- Restaurantes ya definidos anteriormente
  ('El Trapiche', 'el-trapiche',
    'Restaurante de cocina tradicional panameña en ambiente casual.',
    'Panameña', '$$', 'Panamá', 'Panamá', 'Bella Vista',
    'Vía Argentina, El Cangrejo', NULL, NULL, 'eltrapichepty', 'https://www.eltrapicherestaurante.com', NULL, NULL, NULL,
    4.1, 2000, NULL, FALSE, TRUE, TRUE, NULL, TRUE, TRUE),

  ('Fonda Lo Que Hay', 'fonda-lo-que-hay',
    'Fonda panameña contemporánea que reinterpreta platos tradicionales con una propuesta moderna.',
    'Panameña contemporánea', '$$', 'Panamá', 'Panamá', 'San Felipe',
    'Casco Antiguo', NULL, NULL, 'fondaloquehay', NULL, NULL, NULL, NULL,
    4.5, 500, NULL, FALSE, FALSE, FALSE, NULL, NULL, TRUE),

  ('La Tapa del Coco', 'la-tapa-del-coco',
    'Restaurante enfocado en gastronomía afro-panameña y afroantillana.',
    'Afro-panameña', '$$', 'Panamá', 'Panamá', 'San Francisco',
    'Calle 68 Este, Villa Lilla', NULL, NULL, 'latapadelcoco', 'https://latapadelcocopanama.com', NULL, NULL, NULL,
    4.4, 300, NULL, FALSE, TRUE, FALSE, NULL, NULL, TRUE),

  ('Santa Rita Casco Viejo', 'santa-rita-casco-viejo',
    'Restaurante de cocina internacional en el Casco Viejo, con enfoque en tapas, carnes y ambiente social.',
    'Internacional', '$$$', 'Panamá', 'Panamá', 'San Felipe',
    'Casco Viejo', NULL, NULL, 'santaritapanama', NULL, NULL, NULL, NULL,
    4.3, 400, NULL, FALSE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Kanibal Panamá', 'kanibal-panama',
    'Restaurante casual de cocina fusión con platos creativos y ambiente moderno.',
    'Fusión', '$$', 'Panamá', 'Panamá', 'San Francisco',
    'San Francisco', NULL, NULL, 'kanibalpanama', NULL, NULL, NULL, NULL,
    4.0, 150, NULL, TRUE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Kaandela', 'kaandela',
    'Restaurante de autor con ingredientes locales y técnicas contemporáneas.',
    'Panameña contemporánea', '$$$$', 'Panamá', 'Panamá', 'San Francisco',
    'San Francisco', NULL, NULL, 'kaandelarestaurant', NULL, NULL, NULL, NULL,
    4.7, 120, NULL, FALSE, TRUE, TRUE, NULL, TRUE, TRUE),

  ('Madre', 'madre',
    'Restaurante con énfasis en productos locales, cocina de temporada y propuesta panameña-internacional.',
    'Fusión', '$$$', 'Panamá', 'Panamá', 'Bella Vista',
    'Bella Vista', NULL, NULL, 'madrepanama', NULL, NULL, NULL, NULL,
    4.2, 180, NULL, FALSE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Tantalo', 'tantalo',
    'Restaurante y rooftop bar en Casco Viejo con cocina internacional y coctelería.',
    'Internacional', '$$$', 'Panamá', 'Panamá', 'San Felipe',
    'Avenida B y Calle 8, Casco Viejo', NULL, NULL, 'tantalohotel', 'https://tantalo.com', NULL, NULL, NULL,
    4.3, 600, NULL, FALSE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Café Coca Cola', 'cafe-coca-cola',
    'Cafetería histórica del Casco Viejo con desayunos, almuerzos y platos tradicionales.',
    'Café/Desayunos', '$', 'Panamá', 'Panamá', 'Santa Ana',
    'Avenida Central y Calle 12 Oeste', NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    4.0, 400, NULL, FALSE, FALSE, FALSE, NULL, FALSE, TRUE),

  ('Ossa', 'ossa',
    'Restaurante de cocina de autor con enfoque en mariscos e ingredientes locales.',
    'Mariscos/Fusión', '$$$$', 'Panamá', 'Panamá', 'Punta Paitilla',
    'Punta Paitilla', NULL, NULL, 'ossapanama', NULL, NULL, NULL, NULL,
    4.8, 90, NULL, FALSE, TRUE, TRUE, NULL, TRUE, TRUE),

  ('Maito', 'maito',
    'Restaurante reconocido por cocina panameña contemporánea y productos locales.',
    'Panameña contemporánea', '$$$$', 'Panamá', 'Panamá', 'San Francisco',
    'Coco del Mar / San Francisco', NULL, NULL, 'maitopanama', 'https://maitopanama.com', NULL, NULL, NULL,
    4.7, 800, NULL, FALSE, TRUE, TRUE, NULL, TRUE, TRUE),

  ('Segundo Muelle', 'segundo-muelle',
    'Restaurante de cocina peruana, ceviches, mariscos y fusión nikkei.',
    'Peruana/Nikkei', '$$$', 'Panamá', 'Panamá', 'San Francisco',
    'San Francisco', NULL, NULL, 'segundomuellepty', 'https://segundomuelle.com.pa', NULL, NULL, NULL,
    4.3, 300, NULL, TRUE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Nación Sushi', 'nacion-sushi',
    'Cadena de restaurantes de sushi y cocina asiática con múltiples sucursales en Panamá.',
    'Sushi/Japonesa', '$$', 'Panamá', 'Panamá', NULL,
    'Múltiples ubicaciones en Ciudad de Panamá', NULL, NULL, 'nacionsushiofficial', 'https://nacionsushi.com', NULL, NULL, NULL,
    4.2, 700, NULL, TRUE, FALSE, FALSE, NULL, TRUE, TRUE),

  ('Athen’s Pizza', 'athens-pizza',
    'Restaurante clásico de comida griega e italiana, conocido por sus pizzas.',
    'Italiana/Griega', '$$', 'Panamá', 'Panamá', 'Bella Vista',
    'Vía Argentina', NULL, NULL, 'athenspizzapanama', NULL, NULL, NULL, NULL,
    4.1, 350, NULL, FALSE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Slabón', 'slabon',
    'Cadena panameña de hamburguesas artesanales.',
    'Hamburguesas', '$$', 'Panamá', 'Panamá', NULL,
    'Diversas sucursales en Ciudad de Panamá', NULL, NULL, 'slabonburgers', 'https://slabon.com', NULL, NULL, NULL,
    4.0, 500, NULL, TRUE, FALSE, FALSE, NULL, TRUE, TRUE),

  ('Esa Flaca Rica', 'esa-flaca-rica',
    'Hamburguesería conocida por burgers creativas y ambiente informal.',
    'Hamburguesas', '$$', 'Panamá', 'Panamá', 'San Francisco',
    'San Francisco', NULL, NULL, 'esaflacabr', NULL, NULL, NULL, NULL,
    4.3, 250, NULL, TRUE, FALSE, FALSE, NULL, FALSE, TRUE),

  ('Barrio Pizza', 'barrio-pizza',
    'Pizzería artesanal con variedad de pizzas y ambiente casual.',
    'Pizza', '$$', 'Panamá', 'Panamá', 'San Felipe',
    'Casco Viejo', NULL, NULL, 'barriopizzapanama', NULL, NULL, NULL, NULL,
    4.1, 200, NULL, TRUE, FALSE, FALSE, NULL, TRUE, TRUE),

  ('Anti Burger', 'anti-burger',
    'Restaurante casual enfocado en hamburguesas y opciones vegetarianas.',
    'Hamburguesas/Vegetariana', '$$', 'Panamá', 'Panamá', 'San Francisco',
    'San Francisco', NULL, NULL, 'antiburgerpty', NULL, NULL, NULL, NULL,
    4.0, 100, NULL, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE),

  ('Mentiritas Blancas', 'mentiritas-blancas',
    'Cafetería de café de especialidad, brunch y repostería artesanal.',
    'Café/Postres', '$$', 'Panamá', 'Panamá', 'Bella Vista',
    'Bella Vista', NULL, NULL, 'mentiritasblancas', NULL, NULL, NULL, NULL,
    4.5, 300, NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE),

  ('Kotowa Coffee', 'kotowa-coffee',
    'Coffee shop panameño conocido por café de Boquete y productos de cafetería.',
    'Café', '$$', 'Panamá', 'Panamá', NULL,
    'Múltiples locales en Panamá; origen de marca en Boquete', NULL, NULL, 'kotowacoffeehouse', 'https://kotowa.com', NULL, NULL, NULL,
    4.4, 200, NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE),

  ('Unido Coffee Roasters', 'unido-coffee-roasters',
    'Tostadores de café panameño con cafeterías, brunch y postres.',
    'Café', '$$', 'Panamá', 'Panamá', NULL,
    'Múltiples sucursales en Ciudad de Panamá', NULL, NULL, 'unidocoffee', 'https://unidocoffee.com', NULL, NULL, NULL,
    4.3, 220, NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE),

  -- Nuevos restaurantes de la sesión Salchipapas
  ('Iconos Urban Food', 'iconos-urban-food',
    'Restaurante de comida rápida en El Dorado donde sus platos son íconos del sabor urbano; ofrecen salchipapas y otros platos inspirados en lugares turísticos de Panamá.',
    'Comida rápida', '$$', 'Panamá', 'Panamá', 'Betania',
    'El Dorado, Avenida Miguel A. Brostella', NULL, NULL, 'iconosurbanfood', NULL, NULL, NULL, NULL,
    4.1, 150, NULL, TRUE, FALSE, FALSE, NULL, TRUE, TRUE),

  ('Fogata Familiar', 'fogata-familiar',
    'Pequeño restaurante con parrilla al carbón y ambiente de comida rápida colombiana; conocido por sus salchipapas y carnes.',
    'Parrilla/Colombiana', '$$', 'Panamá', 'Panamá', 'San Francisco',
    'Av. Dr. Belisario Porras', NULL, NULL, 'fogatafamiliar', 'https://restaurantefogatafamiliar.com', NULL, NULL, NULL,
    4.2, 180, NULL, TRUE, TRUE, FALSE, NULL, TRUE, TRUE),

  ('Asu Mare', 'asu-mare',
    'Restaurante peruano en Panamá donde la tradición y el sabor se encuentran para ofrecer una experiencia culinaria inolvidable; destaca ceviche, arroz a la chiclayana y otros platos peruanos.',
    'Peruana', '$$$', 'Panamá', 'Panamá', 'San Francisco',
    'Ciudad de Panamá (ubicación en centro comercial)', NULL, NULL, 'asumarepty', 'https://asumarepty.com', NULL, NULL, NULL,
    4.3, 250, NULL, TRUE, TRUE, FALSE, NULL, TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  tipo_cocina = EXCLUDED.tipo_cocina,
  rango_precio = EXCLUDED.rango_precio,
  provincia = EXCLUDED.provincia,
  distrito = EXCLUDED.distrito,
  corregimiento = EXCLUDED.corregimiento,
  direccion = EXCLUDED.direccion,
  telefono = EXCLUDED.telefono,
  whatsapp = EXCLUDED.whatsapp,
  instagram = EXCLUDED.instagram,
  sitio_web = EXCLUDED.sitio_web,
  latitud = EXCLUDED.latitud,
  longitud = EXCLUDED.longitud,
  horario = EXCLUDED.horario,
  rating = EXCLUDED.rating,
  cantidad_resenas = EXCLUDED.cantidad_resenas,
  imagen_url = EXCLUDED.imagen_url,
  delivery = EXCLUDED.delivery,
  reservas = EXCLUDED.reservas,
  parking = EXCLUDED.parking,
  pet_friendly = EXCLUDED.pet_friendly,
  wifi = EXCLUDED.wifi,
  activo = EXCLUDED.activo;

-- =========================
-- 7. Relaciones restaurante-categorías
-- =========================
WITH pares(restaurante_slug, categoria_slug) AS (
  VALUES
    ('el-trapiche', 'comida-panamena'),
    ('el-trapiche', 'desayunos'),

    ('fonda-lo-que-hay', 'comida-panamena'),
    ('fonda-lo-que-hay', 'afroantillana'),
    ('fonda-lo-que-hay', 'bar'),

    ('la-tapa-del-coco', 'afroantillana'),
    ('la-tapa-del-coco', 'comida-panamena'),

    ('santa-rita-casco-viejo', 'internacional'),
    ('santa-rita-casco-viejo', 'carnes'),
    ('santa-rita-casco-viejo', 'bar'),

    ('kanibal-panama', 'internacional'),
    ('kanibal-panama', 'hamburguesas'),

    ('kaandela', 'comida-panamena'),
    ('kaandela', 'internacional'),

    ('madre', 'comida-panamena'),
    ('madre', 'internacional'),

    ('tantalo', 'bar'),
    ('tantalo', 'rooftop'),
    ('tantalo', 'internacional'),

    ('cafe-coca-cola', 'cafe'),
    ('cafe-coca-cola', 'comida-panamena'),
    ('cafe-coca-cola', 'desayunos'),

    ('ossa', 'mariscos'),
    ('ossa', 'internacional'),

    ('maito', 'comida-panamena'),
    ('maito', 'internacional'),

    ('segundo-muelle', 'peruana'),
    ('segundo-muelle', 'mariscos'),

    ('nacion-sushi', 'japonesa'),
    ('nacion-sushi', 'sushi'),

    ('athens-pizza', 'italiana'),
    ('athens-pizza', 'pizza'),

    ('slabon', 'hamburguesas'),

    ('esa-flaca-rica', 'hamburguesas'),

    ('barrio-pizza', 'pizza'),
    ('barrio-pizza', 'italiana'),

    ('anti-burger', 'hamburguesas'),
    ('anti-burger', 'vegetariana'),

    ('mentiritas-blancas', 'cafe'),
    ('mentiritas-blancas', 'postres'),
    ('mentiritas-blancas', 'desayunos'),

    ('kotowa-coffee', 'cafe'),
    ('kotowa-coffee', 'desayunos'),

    ('unido-coffee-roasters', 'cafe'),
    ('unido-coffee-roasters', 'postres'),
    ('unido-coffee-roasters', 'desayunos'),

    -- Relaciones para nuevos restaurantes salchipaperos
    ('iconos-urban-food', 'salchipapas'),
    ('iconos-urban-food', 'hamburguesas'),
    ('iconos-urban-food', 'carnes'),

    ('fogata-familiar', 'salchipapas'),
    ('fogata-familiar', 'carnes'),
    ('fogata-familiar', 'hamburguesas'),

    ('asu-mare', 'peruana'),
    ('asu-mare', 'salchipapas')
)
INSERT INTO restaurante_categorias (restaurante_id, categoria_id)
SELECT r.id, c.id
FROM pares p
JOIN restaurantes r ON r.slug = p.restaurante_slug
JOIN categorias c ON c.slug = p.categoria_slug
ON CONFLICT DO NOTHING;

-- =========================
-- 8. Ejemplos de consultas
-- =========================
-- Para ver ejemplos de consultas y comentarios, consulte el documento de diseño.
