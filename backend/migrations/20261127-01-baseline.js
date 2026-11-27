// Baseline: esquema completo tal como lo dejaba `sequelize.sync()` en Postgres
// hasta nov 2026. Idempotente (IF NOT EXISTS): en la base de producción, que ya
// tiene las tablas creadas por sync({alter:true}), no cambia nada; en una base
// vacía crea todo. Solo Postgres (dev/test usan SQLite + sync()).

const SQL = `
DO $$ BEGIN
  CREATE TYPE public.enum_activities_type AS ENUM ('Xperiencia', 'Xecreto', 'Xelfie', 'Event');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.enum_achievements_type AS ENUM ('Amuleto', 'Follaje');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.houses (
  id uuid NOT NULL,
  name character varying(255) NOT NULL,
  element character varying(255) NOT NULL,
  animal character varying(255) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT houses_pkey PRIMARY KEY (id),
  CONSTRAINT houses_name_key UNIQUE (name),
  CONSTRAINT houses_element_key UNIQUE (element),
  CONSTRAINT houses_animal_key UNIQUE (animal)
);

CREATE TABLE IF NOT EXISTS public."familyTrees" (
  id uuid NOT NULL,
  name character varying(255),
  admin uuid NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT "familyTrees_pkey" PRIMARY KEY (id),
  CONSTRAINT "familyTrees_admin_key" UNIQUE (admin)
);

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  name character varying(255) NOT NULL,
  lastname character varying(255) DEFAULT ''::character varying,
  email character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  birthdate timestamp with time zone NOT NULL,
  "reservationNumber" character varying(255) DEFAULT ''::character varying,
  pronouns character varying(255) DEFAULT ''::character varying,
  casa character varying(255) DEFAULT ''::character varying,
  avatar character varying(255),
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "familyTreeId" uuid,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT "users_familyTreeId_fkey" FOREIGN KEY ("familyTreeId")
    REFERENCES public."familyTrees"(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL,
  name character varying(255) NOT NULL,
  description text,
  location character varying(255) NOT NULL,
  type public.enum_activities_type NOT NULL,
  "isActive" boolean DEFAULT true,
  "minAge" integer,
  "maxAge" integer,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "houseId" uuid,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_name_key UNIQUE (name),
  CONSTRAINT activities_description_key UNIQUE (description),
  CONSTRAINT "activities_houseId_fkey" FOREIGN KEY ("houseId")
    REFERENCES public.houses(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid NOT NULL,
  name character varying(255) NOT NULL,
  description text,
  type public.enum_achievements_type NOT NULL,
  "imageUrl" character varying(255),
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "activityId" uuid,
  "houseId" uuid,
  CONSTRAINT achievements_pkey PRIMARY KEY (id),
  CONSTRAINT "achievements_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "achievements_houseId_fkey" FOREIGN KEY ("houseId")
    REFERENCES public.houses(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.xecretos (
  id uuid NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "activityId" uuid,
  CONSTRAINT xecretos_pkey PRIMARY KEY (id),
  CONSTRAINT "xecretos_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.clues (
  id uuid NOT NULL,
  text text NOT NULL,
  "correctAnswer" character varying(255) NOT NULL,
  "order" integer NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "xecretoId" uuid,
  CONSTRAINT clues_pkey PRIMARY KEY (id),
  CONSTRAINT "clues_xecretoId_fkey" FOREIGN KEY ("xecretoId")
    REFERENCES public.xecretos(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.xelfies (
  id uuid NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "activityId" uuid,
  CONSTRAINT xelfies_pkey PRIMARY KEY (id),
  CONSTRAINT "xelfies_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.xperiencia (
  id uuid NOT NULL,
  "qrCode" character varying(255),
  "isValidable" boolean DEFAULT false,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "activityId" uuid,
  CONSTRAINT xperiencia_pkey PRIMARY KEY (id),
  CONSTRAINT "xperiencia_qrCode_key" UNIQUE ("qrCode"),
  CONSTRAINT "xperiencia_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "activityId" uuid,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT "events_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."userActivities" (
  id uuid NOT NULL,
  "startedAt" timestamp with time zone,
  "completedAt" timestamp with time zone,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "userId" uuid,
  "activityId" uuid,
  CONSTRAINT "userActivities_pkey" PRIMARY KEY (id),
  CONSTRAINT "userActivities_userId_activityId_key" UNIQUE ("userId", "activityId"),
  CONSTRAINT "userActivities_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "userActivities_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."userPreferences" (
  id uuid NOT NULL,
  "isFavorite" boolean DEFAULT false,
  comment text,
  rating integer,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "userId" uuid,
  "activityId" uuid,
  CONSTRAINT "userPreferences_pkey" PRIMARY KEY (id),
  CONSTRAINT "userPreferences_userId_activityId_key" UNIQUE ("userId", "activityId"),
  CONSTRAINT "userPreferences_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "userPreferences_activityId_fkey" FOREIGN KEY ("activityId")
    REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."userXelfies" (
  id uuid NOT NULL,
  "xelfieUrl" character varying(255) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "userId" uuid,
  "xelfieId" uuid,
  CONSTRAINT "userXelfies_pkey" PRIMARY KEY (id),
  CONSTRAINT "userXelfies_xelfieUrl_key" UNIQUE ("xelfieUrl"),
  CONSTRAINT "userXelfies_userId_xelfieId_key" UNIQUE ("userId", "xelfieId"),
  CONSTRAINT "userXelfies_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "userXelfies_xelfieId_fkey" FOREIGN KEY ("xelfieId")
    REFERENCES public.xelfies(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."userAchievements" (
  id uuid NOT NULL,
  amount integer DEFAULT 1,
  "completedAt" timestamp with time zone,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  "userId" uuid,
  "achievementId" uuid,
  CONSTRAINT "userAchievements_pkey" PRIMARY KEY (id),
  CONSTRAINT "userAchievements_userId_achievementId_key" UNIQUE ("userId", "achievementId"),
  CONSTRAINT "userAchievements_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "userAchievements_achievementId_fkey" FOREIGN KEY ("achievementId")
    REFERENCES public.achievements(id) ON UPDATE CASCADE ON DELETE CASCADE
);
`;

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.query(SQL);
  },
  async down() {
    // Baseline: no se revierte.
  },
};
