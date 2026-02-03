export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCWcM1DmICeO7JM_DneTmmcSTWKZ-V1iNQzLM_SOL2HMWFb4-6qq9CSkoLZ5YM-MnJxw/exec";

  if (req.method === 'POST') {
    // 1. PHẢN HỒI NGAY LẬP TỨC
    // Gửi trả kết quả cho Zalo trước để tránh bị Timeout (408)
    res.status(200).json({ message: 'OK' });

    // 2. XỬ LÝ CHUYỂN TIẾP TRONG NỀN (BACKGROUND)
    // Chúng ta không dùng "await" ở đây đối với res, 
    // nhưng vẫn dùng fetch để đẩy dữ liệu đi.
    try {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }).catch(err => console.error("Lỗi gửi tới GAS:", err));
      
      console.log("Đã nhận data từ Zalo và đang gửi sang Google...");
    } catch (error) {
      // Vì đã res.status(200) ở trên nên error này chỉ hiện ở log Vercel
      console.error("Lỗi thực thi:", error);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
