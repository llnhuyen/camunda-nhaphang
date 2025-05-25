const {
  Client,
  logger,
  Variables,
  File,
} = require("camunda-external-task-client-js");

const schedule = require("node-schedule");

// Cấu hình kết nối đến Camunda
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
};

const client = new Client(config);

// Danh sách sản phẩm và tồn kho
let kho = {
  "ao-thun": { soLuong: 4, nguongThap: 5 },
  "quan-jeans": { soLuong: 8, nguongThap: 6 },
  "giay-the-thao": { soLuong: 2, nguongThap: 4 },
};

// Đăng ký lắng nghe External Task từ Camunda (nếu cần)
client.subscribe("bot_ktr_tonkho", async function ({ task, taskService }) {
  // Nếu cần kết nối với Camunda để xử lý task thì viết logic tại đây

  // Hàm kiểm tra và xử lý tồn kho
  function kiemTraVaXuLyTonKho() {
    console.log("\n Đang kiểm tra tồn kho...");

    Object.entries(kho).forEach(([tenSP, { soLuong, nguongThap }]) => {
      console.log(`- ${tenSP}: ${soLuong} (ngưỡng tối thiểu: ${nguongThap})`);

      // Nếu thấp hơn ngưỡng → Tự động đặt hàng bổ sung
      if (soLuong < nguongThap) {
        const soLuongCanDat = nguongThap * 2 - soLuong;
        console.log(
          ` ${tenSP} tồn kho thấp! Đặt thêm ${soLuongCanDat} đơn vị.`
        );
        datHang(tenSP, soLuongCanDat);
      }

      // Nếu tồn kho < 10 → Gửi cảnh báo cho nhân viên
      if (soLuong < 10) {
        guiYeuCauChoNhanVien(tenSP, soLuong);
      } else {
        console.log(` ${tenSP} đủ tồn kho.`);
      }
    });
  }

  // Hàm mô phỏng đặt hàng bổ sung
  function datHang(sanPham, soLuong) {
    kho[sanPham].soLuong += soLuong;
    console.log(
      ` Đã đặt thêm ${soLuong} ${sanPham}. Tồn kho mới: ${kho[sanPham].soLuong}`
    );
  }

  // Hàm mô phỏng gửi yêu cầu cho nhân viên
  function guiYeuCauChoNhanVien(sanPham, soLuongHienTai) {
    console.log(
      ` Gửi yêu cầu cho nhân viên: "${sanPham}" chỉ còn ${soLuongHienTai} cái. Vui lòng nhập thêm!`
    );

    // TODO: Mở rộng - Gửi email, tạo task trong Camunda, gọi webhook, v.v.
  }

  // Chạy định kỳ mỗi 30 giây
  schedule.scheduleJob("*/30 * * * * *", () => {
    kiemTraVaXuLyTonKho();
  });

  console.log(" bot_ktra_tonkho.js đang chạy và theo dõi tồn kho...");
  await taskService.complete(task);
});
