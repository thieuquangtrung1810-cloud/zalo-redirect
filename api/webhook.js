// api/webhook.js
export default function handler(req, res) {
  // Chỉ trả về OK ngay lập tức, không làm gì cả
  res.status(200).send('OK');
}
