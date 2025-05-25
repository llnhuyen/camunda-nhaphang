FROM tomcat:9-jdk17-temurin

# Tải Camunda Tomcat distribution
ADD https://downloads.camunda.cloud/release/camunda-bpm/tomcat/7.20/camunda-bpm-tomcat-7.20.0.tar.gz /tmp/camunda.tar.gz

# Giải nén vào đúng thư mục Tomcat
RUN mkdir /camunda && \
    tar -xzf /tmp/camunda.tar.gz -C /camunda --strip-components=1 && \
    mv /camunda/server/apache-tomcat-*/* /usr/local/tomcat/ && \
    rm -rf /camunda /tmp/camunda.tar.gz

# Copy process definition (.bpmn) và form nếu có
COPY file_hinh_ve/QuyTrinhNhapHang.bpmn /usr/local/tomcat/webapps/camunda-internal/WEB-INF/classes/
COPY *.form /usr/local/tomcat/webapps/camunda-internal/forms/

# Expose port Tomcat
EXPOSE 8080

# Run Tomcat
CMD ["catalina.sh", "run"]
