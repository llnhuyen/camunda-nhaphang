const { Client, logger } = require("camunda-external-task-client-js");
const nodemailer = require("nodemailer");

// Cấu hình Camunda client
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
};

const client = new Client(config);

// Cấu hình tài khoản Gmail để gửi (bạn thay thế bằng tài khoản thực)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your.email@gmail.com",         // Email gửi
    pass: "your_app_password",            // Mật khẩu ứng dụng (App Password, không phải mật khẩu Gmail)
  },
});

client.subscribe("bao_loi_nhap_hang", async function ({ task, taskService }) {
  const tenSP = task.variables.get("ten_san_pham");
  const soDat = task.variables.get("so_luong_dat");
  const soNhan = task.variables.get("so_luong_thuc_nhan");
  const moTaLoi = task.variables.get("loi_mo_ta");
  const emailNCC = task.variables.get("email_nha_cung_cap");

  const subject = `Thông báo lỗi nhập hàng: ${tenSP}`;
  const message = `
Kính gửi nhà cung cấp,

Chúng tôi phát hiện vấn đề với sản phẩm "${tenSP}" trong lần nhập hàng gần nhất:
- Số lượng đặt: ${soDat}
- Số lượng thực nhận: ${soNhan}
- Mô tả lỗi: ${moTaLoi}

Vui lòng kiểm tra và phản hồi sớm.

Trân trọng,
Hệ thống quản lý kho
  `;

  const mailOptions = {
    from: "your.email@gmail.com",
    to: emailNCC,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Đã gửi email lỗi hàng cho: ${emailNCC}`);
  } catch (err) {
    console.error("❌ Gửi email thất bại:", err);
  }

  await taskService.complete(task);
});
