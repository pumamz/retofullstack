# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiar configuración de Maven Wrapper
COPY .mvn/ .mvn/
COPY mvnw .
COPY pom.xml .

# Asegurarse de que mvnw sea ejecutable
RUN chmod +x mvnw

# Descargar dependencias sin compilar
RUN ./mvnw dependency:go-offline -B

# Copiar el código fuente completo
COPY src ./src

# Compilar el proyecto
RUN ./mvnw clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el jar generado
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
