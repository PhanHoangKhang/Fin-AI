import { Users, Zap } from 'lucide-react';

export const StatsBento = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6 font-sans">
          
          {/* Stat 1 */}
          <div className="bg-[#F8F5F0] p-8 rounded-3xl border border-[#E8EDE0] flex flex-col justify-between">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-12 shadow-sm">
              <Users className="text-[#3D5226]" size={24} />
            </div>
            <div>
              <div className="text-5xl font-bold text-[#3D5226] mb-2 font-serif" style={{ fontFamily: 'Lora, serif' }}>5k+</div>
              <p className="text-[#7A7060] font-medium">Nhà đầu tư F0 đã tin dùng</p>
            </div>
          </div>

          {/* Stat 2 - Demo Card */}
          <div className="md:col-span-2 bg-[#2B3A1A] p-8 rounded-3xl border border-[#3D5226] flex flex-col md:flex-row gap-8 items-center justify-between text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7A9B58]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 md:max-w-xs">
              <div className="inline-flex items-center gap-2 bg-[#3D5226] px-3 py-1 rounded-full mb-4">
                <Zap size={16} className="text-[#9CB953]" />
                <span className="text-xs font-bold tracking-wider text-white">XỬ LÝ REAL-TIME</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 font-serif" style={{ fontFamily: 'Lora, serif' }}>1M+ Tin tức</h3>
              <p className="text-white/70">Được hệ thống AI của chúng tôi phân tích, tóm tắt và đánh giá tác động mỗi ngày từ các nguồn tin uy tín nhất.</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-2xl relative z-10 w-full md:w-72 border border-[#E8EDE0]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#F5F0E8] flex items-center justify-center font-bold text-[#2B3A1A] text-sm">MB</div>
                  <span className="font-bold text-[#2B3A1A]">MBB</span>
                </div>
                <span className="text-[#3D5226] font-bold">+1.2%</span>
              </div>
              
              <div className="space-y-3">
                <div className="h-2 w-full bg-[#E8EDE0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3D5226] w-[75%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-[#7A7060] font-medium">
                  <span>Sentiment Score</span>
                  <span className="text-[#3D5226] font-bold">75/100 (Tích cực)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E8EDE0]">
                <p className="text-sm text-[#2B3A1A] font-medium">Lợi nhuận quý 3 tăng trưởng 20% so với cùng kỳ nhờ đẩy mạnh tín dụng bán lẻ...</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default StatsBento;