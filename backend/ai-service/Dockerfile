# Multi-stage build for YellowKart AI Suggestion Service (Quarkus JVM)
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy parent + module POMs first for better layer caching
COPY pom.xml ./pom.xml
COPY ai-service/pom.xml ./ai-service/pom.xml

# Minimal reactor so Maven can resolve the parent when building only ai-service
RUN mkdir -p user-service product-service cart-service order-service payment-service notification-service \
 && printf '<project><modelVersion>4.0.0</modelVersion><parent><groupId>com.yellowkart</groupId><artifactId>yellowkart-backend</artifactId><version>1.0.0-SNAPSHOT</version></parent><artifactId>user-service</artifactId></project>\n' > user-service/pom.xml \
 && cp user-service/pom.xml product-service/pom.xml \
 && cp user-service/pom.xml cart-service/pom.xml \
 && cp user-service/pom.xml order-service/pom.xml \
 && cp user-service/pom.xml payment-service/pom.xml \
 && cp user-service/pom.xml notification-service/pom.xml \
 && sed -i 's/user-service/product-service/' product-service/pom.xml \
 && sed -i 's/user-service/cart-service/' cart-service/pom.xml \
 && sed -i 's/user-service/order-service/' order-service/pom.xml \
 && sed -i 's/user-service/payment-service/' payment-service/pom.xml \
 && sed -i 's/user-service/notification-service/' notification-service/pom.xml

COPY ai-service/src ./ai-service/src

WORKDIR /workspace/ai-service
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/ai-service/target/quarkus-app /app
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV PORT=8007
EXPOSE 8007
# Render injects PORT; Quarkus reads quarkus.http.port from env via application.properties
CMD ["sh", "-c", "java $JAVA_OPTS -jar quarkus-run.jar"]
