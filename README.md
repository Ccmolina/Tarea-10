Plataforma de Reseñas de Libros

Proyecto desarrollado en **Next.js + Prisma + PostgreSQL**, con despliegue en **Vercel** y un flujo de **CI/CD con GitHub Actions**.



##  URL de la Aplicación
 [tarea-10-alpha.vercel.app](https://tarea-10-alpha.vercel.app)



##  Tecnologías Utilizadas
- [Next.js 15](https://nextjs.org/) (frontend + backend en rutas `/app`)
- [Prisma ORM](https://www.prisma.io/) (acceso a la base de datos)
- [PostgreSQL](https://www.postgresql.org/) (base de datos)
- [Vercel](https://vercel.com/) (deploy de producción)
- [GitHub Actions](https://github.com/features/actions) (automatización de CI/CD)
- [Docker](https://www.docker.com/) (contenedorización)



##  Deploy en Producción
La aplicación está deployada en **Vercel** con conexión a la base de datos mediante **Prisma + PostgreSQL**.

- Cada vez que se hace **push a main**, se redeploya automáticamente en Vercel.
- Variables sensibles están configuradas en **Vercel Environment Variables**.



##  Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ccmolina/Tarea-10.git
cd Tarea-10
2. Instalar dependencias
bash
Copiar código
npm install
3. Configurar variables de entorno
Crear un archivo .env en la raíz con:

env
Copiar código
DATABASE_URL=postgresql://usuario:password@host:puerto/db
4. Generar cliente de Prisma
bash
Copiar código
npx prisma generate
5. Ejecutar en desarrollo
bash
Copiar código
npm run dev
La app estará en http://localhost:3000.

 GitHub Actions (CI/CD)
🔹 Workflows configurados
PR – Build & Test

Corre automáticamente en cada Pull Request.

Instala dependencias (npm ci).

Ejecuta npm run build.

Ejecuta los tests.

Si falla, el PR no puede mergearse.

Docker Publish

Se ejecuta al hacer merge en main.

Construye una imagen Docker de la app.

Publica la imagen en GitHub Container Registry con tags:

latest

hash del commit

🔹 Ubicación de los workflows
.github/workflows/pr-tests.yml

.github/workflows/docker-publish.yml

 Ejecución con Docker
1. Construir la imagen
bash
Copiar código
docker build -t tarea10-app .
2. Ejecutar el contenedor
bash
Copiar código
docker run -p 3000:3000 tarea10-app
La app quedará disponible en http://localhost:3000.

 Variables de Entorno
DATABASE_URL → cadena de conexión a PostgreSQL.

 Entregables
URL en producción: tarea-10-alpha.vercel.app

Repositorio GitHub: Ccmolina/Tarea-10

CI/CD Workflows: Configurados en .github/workflows/

Documentación: Este README contiene pasos de ejecución y deploy.

 Desarrollado por Cindy Molina
