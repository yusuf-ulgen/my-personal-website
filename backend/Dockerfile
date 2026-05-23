# 1. Aşama: Maven ile projeyi derleme (Build)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Testleri atlayarak projeyi derliyoruz (.jar dosyasını oluşturuyoruz)
RUN mvn clean package -DskipTests

# 2. Aşama: Derlenen projeyi hafif bir Java ortamında çalıştırma (Run)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# İlk aşamada oluşan .jar dosyasını alıp app.jar olarak kopyalıyoruz
COPY --from=build /app/target/website-*.jar app.jar
# Render'ın sitemizle iletişim kuracağı port
EXPOSE 8080
# Projeyi ayağa kaldıran komut (Bellek limitleri eklenmiş)
ENTRYPOINT ["java", "-Xmx400m", "-Xss512k", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=128m", "-Dspring.jmx.enabled=false", "-jar", "app.jar"]
