// api/webhook.js

export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCWcM1DmICeO7JM_DneTmmcSTWKZ-V1iNQzLM_SOL2HMWFb4-6qq9CSkoLZ5YM-MnJxw/exec";

  // 1. Xử lý lệnh GET (Để khi truy cập trình duyệt không báo lỗi)
  if (req.method === 'GET') {
    return res.status(200).send('Webhook is Active');
  }

  // 2. Xử lý lệnh POST (Zalo gửi tin đến)
  if (req.method === 'POST') {
    try {
      // --- KỸ THUẬT QUAN TRỌNG: Hẹn giờ 2.5 giây ---
      // Nếu Google Sheet quá chậm, ta sẽ bỏ qua nó để trả lời Zalo kịp thời gian
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 giây

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
          signal: controller.signal // Gắn bộ đếm giờ vào
        });
        clearTimeout(timeoutId); // Nếu gửi xong sớm thì hủy bộ đếm
      } catch (err) {
        // Nếu quá 2.5s hoặc lỗi mạng -> Chỉ log ra, KHÔNG báo lỗi về Zalo
        console.log("Google Sheet chậm quá hoặc lỗi, bỏ qua để trả lời Zalo.");
      }

      // 3. TRẢ VỀ 200 OK NGAY LẬP TỨC (Bắt buộc)
      res.status(200).json({ message: 'OK' });

    } catch (error) {
      console.error(error);
      // Dù lỗi gì cũng phải trả về 200 để Zalo không khóa Webhook
      res.status(200).json({ message: 'Error handled' });
    }
  } else {
    // Các method khác
    res.status(200).json({ message: 'OK' });
  }
}
