FROM camunda/camunda-bpm-platform:run-7.20.0

# Copy quy trình và form nếu có
COPY file_hinh_ve/QuyTrinhNhapHang.bpmn /camunda/configuration/resources/
COPY *.form /camunda/configuration/resources/

# Expose port Tomcat
EXPOSE 8080

# Run Tomcat
CMD ["catalina.sh", "run"]
