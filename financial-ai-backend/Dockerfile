# Stage 1: Build JAR với Maven & JDK 17
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime image siêu nhẹ tối ưu RAM cho Render Free (512MB)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Cổng mặc định
ENV PORT=10000
EXPOSE 10000

# Tối ưu bộ nhớ: Giới hạn heap 384MB để không bị Render OOM kill (503 error)
ENTRYPOINT ["sh", "-c", "java -Xmx384m -Xms128m -Dserver.port=${PORT:-10000} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
