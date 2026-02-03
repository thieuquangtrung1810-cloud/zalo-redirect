// api/webhook.js

export default async function handler(req, res) {
  // 1. Link Google Apps Script của bạn
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCWcM1DmICeO7JM_DneTmmcSTWKZ-V1iNQzLM_SOL2HMWFb4-6qq9CSkoLZ5YM-MnJxw/exec";

  // 2. Xử lý lệnh GET (Để kiểm tra trên trình duyệt không lỗi)
  if (req.method === 'GET') {
    return res.status(200).send('Webhook Active');
  }

  // 3. Xử lý lệnh POST (Khi Zalo gửi tin đến)
  if (req.method === 'POST') {
    try {
      // --- KỸ THUẬT QUAN TRỌNG: Hẹn giờ 2 giây ---
      // Nếu Google Sheet xử lý lâu hơn 2 giây, ta sẽ ngắt kết nối để trả lời Zalo ngay
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Giới hạn 2 giây

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
          signal: controller.signal // Gắn bộ đếm giờ vào lệnh gửi
        });
        clearTimeout(timeoutId); // Nếu gửi xong sớm thì hủy bộ đếm
      } catch (err) {
        // Nếu quá 2 giây hoặc lỗi mạng -> Chỉ log ra console, KHÔNG báo lỗi cho Zalo
        console.log("Google Sheet chậm quá, bỏ qua để trả lời Zalo kịp giờ.");
      }

      // 4. BẮT BUỘC: Trả về 200 OK ngay lập tức
      return res.status(200).json({ message: 'OK' });

    } catch (error) {
      console.error(error);
      // Dù lỗi gì cũng phải trả về 200 OK
      return res.status(200).json({ message: 'Error handled' });
    }
  }

  // Mặc định trả về OK
  return res.status(200).json({ message: 'OK' });
}
