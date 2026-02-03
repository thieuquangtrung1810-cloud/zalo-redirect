// api/webhook.js

// 1. Chuyển sang chạy trên Edge Runtime (Tốc độ khởi động siêu nhanh)
export const runtime = 'edge';

export default async function handler(req, context) {
  // 2. Link Google Script của bạn
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCWcM1DmICeO7JM_DneTmmcSTWKZ-V1iNQzLM_SOL2HMWFb4-6qq9CSkoLZ5YM-MnJxw/exec";

  // 3. Xử lý lệnh GET (Để kiểm tra trên trình duyệt)
  if (req.method === 'GET') {
    return new Response('Webhook Active', { status: 200 });
  }

  // 4. Xử lý lệnh POST (Zalo gửi tin đến)
  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // --- KỸ THUẬT QUAN TRỌNG: waitUntil ---
      // Dùng context.waitUntil để dặn Vercel: "Cứ trả lời Zalo đi, việc gửi Google để tui lo sau"
      // Cách này giúp Zalo nhận phản hồi NGAY LẬP TỨC (< 0.5 giây)
      if (body.sender && body.sender.id) {
        context.waitUntil(
          fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).catch(err => console.log("Lỗi gửi Google:", err))
        );
      }

      // 5. Trả về 200 OK ngay lập tức (Không chờ Google)
      return new Response(JSON.stringify({ message: 'OK' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Error' }), { status: 200 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
