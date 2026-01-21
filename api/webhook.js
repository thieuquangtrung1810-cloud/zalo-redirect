// api/webhook.js

export default async function handler(req, res) {
  // 1. Link Google Apps Script của bạn (Thay link chuẩn vào đây)
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/library/d/1DA4ldJ7dzep_CbDkmXdWsVq52dJV2vRjHHhRsN339D8uvF1VOYx9o94q/9";

  // 2. Chỉ xử lý khi Zalo gửi lệnh POST
  if (req.method === 'POST') {
    try {
      // 3. Chuyển tiếp (Forward) dữ liệu sang Google
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      
      // 4. Quan trọng: Trả về 200 OK ngay lập tức để Zalo xác nhận thành công
      res.status(200).json({ message: 'OK' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error forwarding' });
    }
  } else {
    // Nếu ai đó truy cập bằng trình duyệt (GET) -> Báo lỗi
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
