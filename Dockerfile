FROM camunda/camunda-bpm-platform:tomcat-latest

# Copy BPMN file vào đúng thư mục Camunda để tự động load process
COPY file_hinh_ve/QuyTrinhNhapHang.bpmn /camunda/webapps/camunda/WEB-INF/classes/

# Copy các form
COPY *.form /camunda/webapps/camunda/forms/

# Copy source bot và cài đặt nodejs (ví dụ chạy bot với nodejs)
# Bước này cần bổ sung theo bot bạn dùng (nếu bot chạy riêng thì bạn deploy riêng)
