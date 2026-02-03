export default function handler(req, res) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCWcM1DmICeO7JM_DneTmmcSTWKZ-V1iNQzLM_SOL2HMWFb4-6qq9CSkoLZ5YM-MnJxw/exec";

  // 1. TRẢ LỜI ZALO NGAY LẬP TỨC (Dưới 100ms)
  // Điều này giúp Zalo nhận được 200 OK ngay và không báo lỗi 408 nữa.
  res.status(200).json({ message: 'OK' });

  // 2. XỬ LÝ CHUYỂN TIẾP SAU (Bỏ await ở đây)
  if (req.method === 'POST') {
    // Không dùng await ở trước fetch để hàm không bị dừng lại chờ Google
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }).catch(err => console.error("Lỗi gửi GAS trong nền:", err));
    
    // Log này sẽ xuất hiện trong tab Logs của bạn để theo dõi
    console.log("Dữ liệu đang được đẩy sang Google Apps Script...");
  }
}
