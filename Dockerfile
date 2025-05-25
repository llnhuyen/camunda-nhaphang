FROM camunda/camunda-bpm-platform:tomcat-latest

# Copy BPMN file vào đúng thư mục Camunda để tự động load process
COPY file_hinh_ve/QuyTrinhNhapHang.bpmn /camunda/webapps/camunda/WEB-INF/classes/

# Copy các form
COPY *.form /camunda/webapps/camunda/forms/
COPY *.form /usr/local/tomcat/webapps/camunda-internal/forms/

# Expose port Tomcat
EXPOSE 8080

# Run Tomcat
CMD ["catalina.sh", "run"]
