import { useState, useEffect } from "react";

export interface Post {
  post_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  post_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Mock data for production simulation
const MOCK_ABOUT_US_POST: Post = {
  post_id: 1,
  category_id: null,
  title: "VỀ CHÚNG TÔI - CÔNG TY TNHH HƯNG THỊNH",
  slug: "ve-chung-toi",
  excerpt:
    "CÔNG TY TNHH MÁY VÀ THIẾT BỊ HƯNG THỊNH - Đối tác tin cậy trong lĩnh vực cung cấp giải pháp máy móc công nghiệp và thiết bị thủy lực tại Việt Nam.",
  content: `
    <div class="space-y-8">
      <section>
        <h2 class="text-3xl font-black text-brand-primary mb-4 uppercase">Câu chuyện của chúng tôi</h2>
        <p class="text-slate-600 leading-relaxed text-lg">
          Được thành lập với khát vọng nâng tầm nền công nghiệp Việt Nam, <strong>CÔNG TY TNHH MÁY VÀ THIẾT BỊ HƯNG THỊNH</strong> đã không ngừng nỗ lực để trở thành nhà cung cấp hàng đầu các thiết bị máy móc, ống thủy lực và phụ kiện công nghiệp. Chúng tôi hiểu rằng, sự thành công của khách hàng chính là thước đo giá trị chính xác nhất cho uy tín của chúng tôi.
        </p>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
        <div class="bg-brand-primary p-8 rounded-3xl text-white">
          <h3 class="text-2xl font-bold mb-4 uppercase">Tầm nhìn</h3>
          <p class="opacity-90 leading-relaxed">
            Trở thành hệ sinh thái cung ứng vật tư cơ khí và giải pháp kỹ thuật toàn diện nhất, là lựa chọn số 1 cho các doanh nghiệp sản xuất và bảo trì máy móc tại thị trường khu vực.
          </p>
        </div>
        <div class="bg-brand-accent p-8 rounded-3xl text-brand-primary">
          <h3 class="text-2xl font-bold mb-4 uppercase">Sứ mệnh</h3>
          <p class="opacity-90 leading-relaxed font-medium">
            Cung cấp những sản phẩm chất lượng tiêu chuẩn quốc tế với chi phí tối ưu nhất, đồng thời đem lại dịch vụ hỗ trợ kỹ thuật chuyên nghiệp, tận tâm giúp khách hàng vận hành máy móc an toàn và hiệu quả.
          </p>
        </div>
      </div>

      <section>
        <h2 class="text-3xl font-black text-brand-primary mb-4 uppercase">Tại sao nên chọn Hưng Thịnh?</h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-4">
            <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-800">Sản phẩm chính hãng</h4>
              <p class="text-slate-500">Cam kết 100% sản phẩm có nguồn gốc xuất xứ rõ ràng từ các thương hiệu uy tín.</p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-800">Kho hàng đa dạng</h4>
              <p class="text-slate-500">Luôn có sẵn hàng nghìn mã sản phẩm để đáp ứng nhu cầu giao hàng nhanh chóng.</p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-800">Đội ngũ chuyên gia</h4>
              <p class="text-slate-500">Kỹ thuật viên giàu kinh nghiệm sẵn sàng tư vấn giải pháp tối ưu cho mọi hệ thống máy móc.</p>
            </div>
          </li>
        </ul>
      </section>

      <div class="rounded-3xl overflow-hidden shadow-2xl relative h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop" 
          alt="Xưởng máy" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent flex items-end p-12">
          <p class="text-white text-3xl font-black uppercase italic tracking-tighter">Uy tín làm nên thương hiệu</p>
        </div>
      </div>
    </div>
  `,
  thumbnail:
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1200&auto=format&fit=crop",
  post_type: "GioiThieu",
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAboutUs = () => {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching by post_type="GioiThieu"
    const timer = setTimeout(() => {
      setData(MOCK_ABOUT_US_POST);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};
