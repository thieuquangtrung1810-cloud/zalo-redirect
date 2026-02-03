// api/webhook.js

// KHÔNG dùng 'edge', chạy Node.js mặc định cho an toàn
export default function handler(req, res) {
  
  // 1. In ra log để biết Zalo có gọi đến không (Xem trong Vercel Logs)
  console.log("Zalo đang gọi Webhook:", req.method);

  // 2. Trả lời ngay lập tức (Bất kể GET hay POST)
  // Dùng .send() thay vì .json() để đảm bảo tương thích mọi trình duyệt
  res.status(200).send('OK');
}
