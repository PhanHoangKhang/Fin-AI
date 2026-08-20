"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Term, CategoryOption } from '../../types';
import { DictionaryCard } from '../../components/DictionaryCard';
import { DictionaryModal } from '../../components/DictionaryModal';
import { StockLogo } from '../../components/StockLogo';
import { glossaryService, stockService, type StockInfo } from '../../services/api';

// Bộ dữ liệu thuật ngữ tài chính chuyên sâu & phong phú
const COMPREHENSIVE_TERMS: Term[] = [
  {
    id: "pe",
    term: "P/E",
    fullName: "Price to Earnings Ratio (Hệ số Giá / Lợi nhuận)",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Đánh giá mối quan hệ giữa giá thị trường của cổ phiếu và lợi nhuận trên mỗi cổ phiếu (EPS).",
    fullDefinition: "Chỉ số P/E thể hiện nhà đầu tư sẵn sàng trả bao nhiêu tiền cho 1 đồng lợi nhuận của doanh nghiệp. P/E thấp có thể là dấu hiệu cổ phiếu bị định giá thấp hoặc triển vọng tương lai ảm đạm.",
    example: "HPG có P/E = 8.5x, thấp hơn trung bình ngành thép là 12x, cho thấy định giá đang ở vùng hấp dẫn.",
    firstLetter: "P"
  },
  {
    id: "pb",
    term: "P/B",
    fullName: "Price to Book Ratio (Hệ số Giá / Giá trị sổ sách)",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "So sánh giá thị trường của cổ phiếu với giá trị tài sản ròng trên mỗi cổ phiếu.",
    fullDefinition: "Chỉ số P/B giúp nhà đầu tư xác định xem giá cổ phiếu đang đắt hay rẻ so với vốn chủ sở hữu thực tế của công ty. Thường áp dụng rất hiệu quả cho nhóm Ngân hàng và Bất động sản.",
    example: "MBB có P/B = 1.1x, thấp hơn mức trung bình 1.4x của toàn ngành ngân hàng.",
    firstLetter: "P"
  },
  {
    id: "eps",
    term: "EPS",
    fullName: "Earnings Per Share (Lợi nhuận trên mỗi cổ phiếu)",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Phần lợi nhuận ròng sau thuế phân bổ cho mỗi cổ phiếu đang lưu hành trên thị trường.",
    fullDefinition: "EPS là thước đo trực tiếp khả năng tạo ra lợi nhuận cho cổ đông của doanh nghiệp. EPS liên tục tăng trưởng qua các năm là dấu hiệu của một công ty tăng trưởng mạnh.",
    example: "FPT đạt EPS năm gần nhất là 5,200 VND/cổ phiếu, tăng trưởng 22% so với năm trước.",
    firstLetter: "E"
  },
  {
    id: "roe",
    term: "ROE",
    fullName: "Return on Equity (Tỷ suất sinh lời trên vốn chủ sở hữu)",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Đo lường mức độ hiệu quả trong việc sử dụng 1 đồng vốn chủ sở hữu để tạo ra lợi nhuận.",
    fullDefinition: "ROE = Lợi nhuận sau thuế / Vốn chủ sở hữu bình quân. Doanh nghiệp có ROE duy trì trên 15-20% trong nhiều năm thường sở hữu lợi thế cạnh tranh bền vững (Moat).",
    example: "VNM duy trì ROE trên 28% suốt 5 năm liền nhờ vị thế thống lĩnh thị phần ngành sữa.",
    firstLetter: "R"
  },
  {
    id: "roa",
    term: "ROA",
    fullName: "Return on Assets (Tỷ suất sinh lời trên tổng tài sản)",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Thước đo hiệu quả sinh lời của toàn bộ tài sản doanh nghiệp đang nắm giữ.",
    fullDefinition: "ROA cho biết doanh nghiệp tạo ra bao nhiêu đồng lợi nhuận từ 1 đồng tổng tài sản (bao gồm cả vốn vay và vốn tự có).",
    example: "ACB có ROA đạt 2.4%, thuộc nhóm cao nhất trong hệ thống ngân hàng thương mại Việt Nam.",
    firstLetter: "R"
  },
  {
    id: "ebitda",
    term: "EBITDA",
    fullName: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Lợi nhuận trước lãi vay, thuế và khấu hao tài sản.",
    fullDefinition: "EBITDA phản ánh chính xác hiệu quả hoạt động kinh doanh cốt lõi của doanh nghiệp mà không bị ảnh hưởng bởi cấu trúc vốn (nợ vay), chính sách thuế hay phương pháp trích khấu hao.",
    example: "HPG công bố EBITDA quý 2 đạt 8,200 tỷ đồng nhờ nhà máy Dung Quất chạy tối đa công suất.",
    firstLetter: "E"
  },
  {
    id: "nim",
    term: "NIM",
    fullName: "Net Interest Margin (Biên thu nhập lãi thuần)",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Chỉ số phản ánh chênh lệch giữa lãi suất cho vay và chi phí huy động vốn của ngân hàng.",
    fullDefinition: "NIM là chỉ số quan trọng nhất đánh giá khả năng sinh lời cốt lõi của nhóm cổ phiếu Ngân hàng. NIM càng cao chứng tỏ ngân hàng có nguồn vốn rẻ (CASA) và cho vay hiệu quả.",
    example: "Techcombank (TCB) sở hữu tỷ lệ CASA trên 40%, giúp duy trì NIM ở mức cao 4.2%.",
    firstLetter: "N"
  },
  {
    id: "margin",
    term: "Margin",
    fullName: "Giao dịch ký quỹ (Đòn bẩy tài chính)",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Sử dụng khoản vay từ công ty chứng khoán để mua thêm cổ phiếu ngoài số vốn tự có.",
    fullDefinition: "Margin giúp gia tăng tỷ suất sinh lời khi cổ phiếu tăng giá, nhưng cũng nhân đôi mức độ thua lỗ và rủi ro khi thị trường giảm giá mạnh.",
    example: "Nhà đầu tư có 100 triệu, sử dụng tỷ lệ Margin 1:1 để giải ngân mua 200 triệu cổ phiếu SSI.",
    firstLetter: "M"
  },
  {
    id: "margin-call",
    term: "Margin Call",
    fullName: "Lệnh gọi bổ sung ký quỹ",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Yêu cầu từ CTCK bắt buộc nộp thêm tiền hoặc bán bớt cổ phiếu khi tỷ lệ tài khoản chạm ngưỡng an toàn.",
    fullDefinition: "Khi giá cổ phiếu giảm sâu khiến tỷ lệ ký quỹ thực tế rơi xuống dưới mức tối thiểu (thường là 35-40%), CTCK sẽ kích hoạt Margin Call yêu cầu xử lý trong thời hạn quy định.",
    example: "Thị trường giảm 30 điểm khiến hàng loạt tài khoản full-margin nhận thông báo Margin Call.",
    firstLetter: "M"
  },
  {
    id: "force-sell",
    term: "Force Sell",
    fullName: "Bán giải chấp bắt buộc",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "CTCK chủ động bán cổ phiếu trong tài khoản nhà đầu tư để thu hồi nợ vay.",
    fullDefinition: "Xảy ra khi tài khoản đã bị Margin Call nhưng nhà đầu tư không nộp thêm tiền hoặc thị trường giảm sàn mất thanh khoản nhiều phiên liên tiếp.",
    example: "Làn sóng Force Sell diện rộng vào phiên chiều gây áp lực bán mạnh khiến VN-Index giảm sâu.",
    firstLetter: "F"
  },
  {
    id: "rsi",
    term: "RSI",
    fullName: "Relative Strength Index (Chỉ số Sức mạnh Tương đối)",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Chỉ báo đo lường vận tốc và mức độ biến động giá trên thang điểm từ 0 đến 100.",
    fullDefinition: "RSI trên 70 báo hiệu vùng Quá Mua (Overbought - rủi ro điều chỉnh), RSI dưới 30 báo hiệu vùng Quá Bán (Oversold - cơ hội phục hồi kỹ thuật). Phân kỳ RSI là tín hiệu đảo chiều mạnh.",
    example: "Cổ phiếu SSI rơi về vùng RSI 26 xuất hiện tín hiệu phân kỳ dương 2 đáy, báo hiệu nhịp hồi phục.",
    firstLetter: "R"
  },
  {
    id: "macd",
    term: "MACD",
    fullName: "Moving Average Convergence Divergence",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Chỉ báo xu hướng động lượng dựa trên sự hội tụ và phân kỳ của hai đường trung bình động.",
    fullDefinition: "Gồm đường MACD và đường Tín hiệu (Signal). Khi MACD cắt lên Signal phát tín hiệu MUA; khi MACD cắt xuống Signal phát tín hiệu BÁN.",
    example: "Đường MACD của VND vừa cắt lên đường Signal trên đồ thị ngày (D1), mở ra điểm mua lướt sóng.",
    firstLetter: "M"
  },
  {
    id: "ma",
    term: "MA (Moving Average)",
    fullName: "Đường trung bình động (MA20, MA50, MA200)",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Đường làm mượt biến động giá bằng cách tính giá đóng cửa trung bình trong N phiên.",
    fullDefinition: "MA20 thể hiện xu hướng ngắn hạn, MA50 thể hiện trung hạn, và MA200 là ranh giới phân định xu hướng Uptrend/Downtrend dài hạn của một cổ phiếu.",
    example: "VN-Index test thành công đường hỗ trợ MA200 ngày tại 1,220 điểm và bật tăng trở lại.",
    firstLetter: "M"
  },
  {
    id: "bollinger-bands",
    term: "Bollinger Bands",
    fullName: "Dải biến động Bollinger Bands",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Chỉ báo gồm đường MA20 ở giữa và 2 dải biên trên/dưới thể hiện độ biến động của giá.",
    fullDefinition: "Khi 2 dải Bollinger Bands thắt nút cổ chai (co hẹp), báo hiệu cổ phiếu sắp bước vào một nhịp bùng nổ biến động giá cực mạnh theo chiều bứt phá.",
    example: "MWG tích lũy bóp dải Bollinger Bands chặt trước khi nổ thanh khoản bứt phá vượt đỉnh.",
    firstLetter: "B"
  },
  {
    id: "ho-tro-khang-cu",
    term: "Hỗ trợ & Kháng cự",
    fullName: "Support & Resistance Levels",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Các vùng giá trong quá khứ mà tại đó lực mua hoặc lực bán xuất hiện áp đảo.",
    fullDefinition: "Vùng hỗ trợ là nơi lực cầu mua vào nâng đỡ giá không giảm thêm. Vùng kháng cự là nơi lực cung bán ra đè giá khó vượt qua. Khi kháng cự bị phá vỡ sẽ trở thành hỗ trợ mới.",
    example: "Vùng giá 28,000đ là ngưỡng hỗ trợ cứng của HPG được bảo vệ vững chắc suốt 3 tháng qua.",
    firstLetter: "H"
  },
  {
    id: "breakout",
    term: "Breakout",
    fullName: "Bứt phá nền giá & Kháng cự",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Hiện tượng giá cổ phiếu vượt dứt khoát qua ngưỡng kháng cự hoặc vùng tích lũy với khối lượng lớn.",
    fullDefinition: "Một phiên Breakout chuẩn mực cần hội tụ cả 2 yếu tố: Giá tăng mạnh (biên độ lớn) và Khối lượng khớp lệnh (Volume) cao đột biến gấp 1.5 - 2 lần trung bình 20 phiên.",
    example: "FPT phiên nay Breakout đỉnh lịch sử với thanh khoản khớp lệnh hơn 8 triệu cổ phiếu.",
    firstLetter: "B"
  },
  {
    id: "atc-ato",
    term: "ATO / ATC",
    fullName: "At The Open / At The Close",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Lệnh đặt mua hoặc bán tại mức giá mở cửa (ATO) hoặc đóng cửa (ATC) của ngày giao dịch.",
    fullDefinition: "Lệnh ATO/ATC được ưu tiên khớp trước tất cả các lệnh giới hạn (LO). Mức giá khớp cuối cùng là mức giá đạt khối lượng giao dịch lớn nhất trong phiên định kỳ.",
    example: "Các quỹ ETF thường thực hiện tái cơ cấu danh mục vào đúng 15 phút phiên khớp lệnh ATC.",
    firstLetter: "A"
  },
  {
    id: "khoi-ngoai",
    term: "Khối ngoại (FII)",
    fullName: "Giao dịch của Nhà đầu tư Nước ngoài",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Dòng tiền mua và bán ròng từ các quỹ đầu tư, tổ chức và cá nhân ngoại quốc.",
    fullDefinition: "Động thái mua/bán ròng của khối ngoại tác động lớn tới tâm lý thị trường, tỷ giá và xu hướng định giá của các cổ phiếu vốn hóa lớn (Bluechips).",
    example: "Khối ngoại quay lại mua ròng hơn 1,200 tỷ đồng trên sàn HOSE tập trung vào VCB và FPT.",
    firstLetter: "K"
  },
  {
    id: "tu-doanh",
    term: "Tự doanh",
    fullName: "Khối Tự doanh của các Công ty Chứng khoán",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Bộ phận dùng chính nguồn vốn của CTCK để đầu tư mua bán cổ phiếu trên thị trường.",
    fullDefinition: "Dữ liệu mua bán của khối tự doanh phản ánh góc nhìn và chiến lược của các chuyên gia phân tích tài chính chuyên nghiệp tại các tổ chức hàng đầu.",
    example: "Tự doanh CTCK mua ròng 153 tỷ đồng trên HoSE trong phiên giao dịch hôm nay.",
    firstLetter: "T"
  },
  {
    id: "co-tuc",
    term: "Cổ tức (Dividend)",
    fullName: "Cổ tức bằng Tiền mặt & Cổ phiếu",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Phần lợi nhuận sau thuế doanh nghiệp trích ra chi trả lại cho các cổ đông nắm giữ cổ phiếu.",
    fullDefinition: "Có 2 hình thức: Cổ tức tiền mặt (nhận tiền vào tài khoản) và Cổ tức cổ phiếu (tăng số lượng cổ phiếu). Vào ngày giao dịch không hưởng quyền (GDKHQ), giá cổ phiếu sẽ được điều chỉnh kỹ thuật tương ứng.",
    example: "VNM chốt quyền tạm ứng cổ tức đợt 1 bằng tiền mặt với tỷ lệ 15% (1,500đ/cổ phiếu).",
    firstLetter: "C"
  },
  {
    id: "room-ngoai",
    term: "Room ngoại (FOL)",
    fullName: "Foreign Ownership Limit (Tỷ lệ sở hữu tối đa của khối ngoại)",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Tỷ lệ phần trăm cổ phần tối đa mà nhà đầu tư nước ngoài được phép nắm giữ tại một công ty niêm yết.",
    fullDefinition: "Tại Việt Nam, tỷ lệ room ngoại phổ biến là 30% đối với ngành Ngân hàng và 49% đối với hầu hết các ngành kinh doanh có điều kiện khác. Khi hết room, khối ngoại chỉ có thể mua thỏa thuận với mức chênh lệch giá (Premium).",
    example: "FPT và MWG luôn trong trạng thái kín 49% room ngoại và được khối ngoại săn đón.",
    firstLetter: "R"
  },
  {
    id: "de",
    term: "D/E (Debt to Equity)",
    fullName: "Hệ số Nợ vay trên Vốn chủ sở hữu",
    category: "BAO_CAO_TAI_CHINH",
    categoryName: "Báo cáo tài chính",
    shortDefinition: "Chỉ số đánh giá mức độ sử dụng đòn bẩy tài chính và cấu trúc vốn của doanh nghiệp.",
    fullDefinition: "D/E = Tổng nợ vay / Vốn chủ sở hữu. D/E quá cao (trên 2.0x - 3.0x) cho thấy doanh nghiệp phụ thuộc nhiều vào vốn vay, chịu rủi ro chi phí lãi vay lớn khi lãi suất tăng.",
    example: "Vinhomes duy trì D/E ở mức an toàn 0.8x nhờ dòng tiền bán hàng gối đầu dồi dào.",
    firstLetter: "D"
  },
  {
    id: "lai-suat-dieu-hanh",
    term: "Lãi suất điều hành",
    fullName: "Chính sách lãi suất của Ngân hàng Nhà nước (NHNN)",
    category: "VI_MO",
    categoryName: "Vĩ mô",
    shortDefinition: "Công cụ chính sách tiền tệ dùng để điều tiết thanh khoản, kiểm soát lạm phát và hỗ trợ tăng trưởng.",
    fullDefinition: "Bao gồm lãi suất tái cấp vốn, tái chiết khấu và trần lãi suất tiền gửi. Khi NHNN hạ lãi suất điều hành, dòng tiền rẻ sẽ có xu hướng chảy mạnh vào thị trường chứng khoán.",
    example: "NHNN duy trì chính sách nới lỏng tiền tệ với lãi suất điều hành thấp kỷ lục nhằm kích thích sản xuất kinh doanh.",
    firstLetter: "L"
  },
  {
    id: "lam-phat-cpi",
    term: "Lạm phát & CPI",
    fullName: "Consumer Price Index (Chỉ số Giá Tiêu dùng)",
    category: "VI_MO",
    categoryName: "Vĩ mô",
    shortDefinition: "Chỉ số đo lường mức độ biến động giá bình quân của giỏ hàng hóa và dịch vụ tiêu dùng theo thời gian.",
    fullDefinition: "Lạm phát tăng cao vượt mục tiêu buộc các ngân hàng trung ương phải thắt chặt tiền tệ và tăng lãi suất, thường gây áp lực tiêu cực lên định giá thị trường chứng khoán.",
    example: "CPI bình quân 7 tháng đầu năm tăng 4.12%, vẫn nằm trong biên độ kiểm soát mục tiêu dưới 4.5% của Chính phủ.",
    firstLetter: "L"
  },
  {
    id: "ty-gia-usd-vnd",
    term: "Tỷ giá USD/VND",
    fullName: "Tỷ giá hối đoái Đô la Mỹ / Việt Nam Đồng",
    category: "VI_MO",
    categoryName: "Vĩ mô",
    shortDefinition: "Mức giá quy đổi giữa đồng Đô la Mỹ và đồng Việt Nam.",
    fullDefinition: "Tỷ giá tăng (VND mất giá) tạo áp lực lên lạm phát, chi phí nhập khẩu nguyên liệu và khiến khối ngoại có xu hướng bán ròng rút vốn về nước; ngược lại giúp các doanh nghiệp xuất khẩu (thủy sản, dệt may) hưởng lợi.",
    example: "Tỷ giá USD/VND hạ nhiệt sau khi FED phát đi tín hiệu chuẩn bị cắt giảm lãi suất cơ bản.",
    firstLetter: "T"
  },
  {
    id: "gdp",
    term: "GDP",
    fullName: "Gross Domestic Product (Tổng sản phẩm quốc nội)",
    category: "VI_MO",
    categoryName: "Vĩ mô",
    shortDefinition: "Tổng giá trị thị trường của tất cả hàng hóa và dịch vụ cuối cùng được sản xuất trong nước trong một thời kỳ.",
    fullDefinition: "Tốc độ tăng trưởng GDP là phong vũ biểu đo lường sức khỏe toàn diện của nền kinh tế. Tăng trưởng GDP cao và ổn định là nền tảng vững chắc nhất cho thị trường chứng khoán tăng điểm dài hạn.",
    example: "Việt Nam đặt mục tiêu tăng trưởng GDP cả năm 2026 đạt 6.5% - 7.0%.",
    firstLetter: "G"
  }
];

const CATEGORIES: CategoryOption[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'CHUNG_KHOAN_CO_BAN', label: 'Chứng khoán cơ bản' },
  { key: 'PHAN_TICH_KY_THUAT', label: 'Phân tích kỹ thuật' },
  { key: 'BAO_CAO_TAI_CHINH', label: 'Báo cáo tài chính' },
  { key: 'VI_MO', label: 'Vĩ mô' }
];

const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ==========================================
// SUB-COMPONENT: DICTIONARY SEARCH
// ==========================================
interface DictionarySearchProps {
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  categories: CategoryOption[];
  alphabet: string[];
  totalResults: number;
}

const DictionarySearch: React.FC<DictionarySearchProps> = ({
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLetter,
  onLetterChange,
  categories,
  alphabet,
  totalResults,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E8EDE0] shadow-sm space-y-4 font-sans">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm nhanh thuật ngữ (VD: P/E, RSI, Margin, EBITDA, NIM, Cổ tức, Khối ngoại...)"
          className="w-full pl-11 pr-4 py-3 bg-[#F8F5F0]/60 border border-[#E8EDE0] rounded-xl text-sm placeholder-[#7A7060]/70 text-[#2B3A1A] focus:outline-none focus:border-[#7A9B58] focus:ring-2 focus:ring-[#9CB953]/20 transition"
        />
        <svg
          className="w-4 h-4 text-[#7A7060] absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedCategory === cat.key
                ? 'bg-[#3D5226] text-white shadow-xs'
                : 'bg-white text-[#5A5248] border border-[#E8EDE0] hover:bg-[#F8F5F0] hover:text-[#2B3A1A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-xs text-[#A09888] ml-auto hidden sm:inline font-mono">
          {totalResults} thuật ngữ
        </span>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-[#F0EDE6]">
        <button
          type="button"
          onClick={() => onLetterChange('')}
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
            !selectedLetter
              ? 'bg-[#3D5226] text-white shadow-xs'
              : 'text-[#5A5248] hover:bg-[#F8F5F0]'
          }`}
        >
          Tất cả (A-Z)
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterChange(letter === selectedLetter ? '' : letter)}
            className={`w-7 h-7 flex items-center justify-center text-xs rounded-lg font-bold font-mono transition ${
              selectedLetter === letter
                ? 'bg-[#3D5226] text-white shadow-xs'
                : 'text-[#5A5248] hover:bg-[#F8F5F0] hover:text-[#2B3A1A]'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export const DictionaryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'stock'>('dictionary');

  // --- State Thuật ngữ ---
  const [terms, setTerms] = useState<Term[]>(COMPREHENSIVE_TERMS);
  const [loadingTerms, setLoadingTerms] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  // --- State Cổ phiếu ---
  const [ticker, setTicker] = useState<string>('');
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);
  const [stockError, setStockError] = useState<string>('');

  // Fetch danh sách thuật ngữ từ Spring Boot API (với fallback danh mục phong phú)
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoadingTerms(true);
        const data = await glossaryService.getAll();
        if (Array.isArray(data) && data.length >= COMPREHENSIVE_TERMS.length) {
          setTerms(data);
        } else {
          setTerms(COMPREHENSIVE_TERMS);
        }
      } catch (error) {
        setTerms(COMPREHENSIVE_TERMS);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, []);

  // Lọc thuật ngữ theo từ khóa, chuyên mục và chữ cái đầu
  const filteredTerms = useMemo(() => {
    return terms.filter((item) => {
      const query = searchKeyword.toLowerCase().trim();
      const termMatch = item.term?.toLowerCase().includes(query) ?? false;
      const fullNameMatch = item.fullName?.toLowerCase().includes(query) ?? false;
      const shortDefMatch = item.shortDefinition?.toLowerCase().includes(query) ?? false;
      const fullDefMatch = item.fullDefinition?.toLowerCase().includes(query) ?? false;

      const matchKeyword = !query || termMatch || fullNameMatch || shortDefMatch || fullDefMatch;
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      const firstChar = item.firstLetter || item.term?.charAt(0) || '';
      const matchLetter = !selectedLetter || firstChar.toUpperCase() === selectedLetter.toUpperCase();

      return matchKeyword && matchCategory && matchLetter;
    });
  }, [terms, searchKeyword, selectedCategory, selectedLetter]);

  // Handler Tra cứu Cổ phiếu
  const handleStockSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;

    setLoadingStock(true);
    setStockError('');
    setStockInfo(null);

    try {
      const data = await stockService.getStockInfo(cleanTicker);
      if (data && data.ticker) {
        setStockInfo(data);
      } else {
        setStockError(`Không tìm thấy dữ liệu cho mã cổ phiếu "${cleanTicker}"`);
      }
    } catch (err) {
      setStockError(`Không tìm thấy dữ liệu cho mã cổ phiếu "${cleanTicker}"`);
    } finally {
      setLoadingStock(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header chính */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2B3A1A] font-serif" style={{ fontFamily: 'Lora, serif' }}>
            Trung tâm Tra cứu Tài chính
          </h1>
          <p className="text-sm text-[#7A7060]">
            Bách khoa toàn thư thuật ngữ chứng khoán F0 và cổng tra cứu hồ sơ doanh nghiệp niêm yết.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8EDE0] gap-8">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`pb-3 text-sm font-bold transition relative ${
              activeTab === 'dictionary'
                ? 'text-[#2B3A1A] border-b-2 border-[#3D5226]'
                : 'text-[#7A7060] hover:text-[#3D5226]'
            }`}
          >
            Từ điển Thuật ngữ ({COMPREHENSIVE_TERMS.length})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-3 text-sm font-bold transition relative ${
              activeTab === 'stock'
                ? 'text-[#2B3A1A] border-b-2 border-[#3D5226]'
                : 'text-[#7A7060] hover:text-[#3D5226]'
            }`}
          >
            Tra cứu Cổ phiếu
          </button>
        </div>

        {/* TAB 1: TỪ ĐIỂN THUẬT NGỮ */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            <DictionarySearch
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLetter={selectedLetter}
              onLetterChange={setSelectedLetter}
              categories={CATEGORIES}
              alphabet={ALPHABET}
              totalResults={filteredTerms.length}
            />

            {loadingTerms ? (
              <div className="py-20 text-center text-sm text-[#7A7060] animate-pulse">
                Đang nạp kho dữ liệu thuật ngữ tài chính...
              </div>
            ) : filteredTerms.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8EDE0] shadow-sm">
                <div className="w-12 h-12 mx-auto bg-[#F8F5F0] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#A09888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#2B3A1A] mb-1">Không tìm thấy thuật ngữ nào</h3>
                <p className="text-xs text-[#7A7060]">
                  Thử tìm kiếm với từ khóa khác (VD: "P/E", "RSI", "Margin", "Cổ tức").
                </p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredTerms.map((term) => (
                    <DictionaryCard key={term.id} term={term} onClick={setSelectedTerm} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            <DictionaryModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
          </div>
        )}

        {/* TAB 2: TRA CỨU CỔ PHIẾU */}
        {activeTab === 'stock' && (
          <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleStockSearch} className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Nhập mã CP (VD: HPG, VNM, FPT...)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-[#E8EDE0] rounded-xl text-sm placeholder-[#7A7060]/70 focus:outline-none focus:border-[#7A9B58] focus:ring-2 focus:ring-[#9CB953]/20 uppercase font-mono font-bold"
              />
              <button
                type="submit"
                disabled={loadingStock}
                className="px-5 py-2.5 bg-[#3D5226] hover:bg-[#2B3A1A] text-white text-xs font-bold rounded-xl transition disabled:opacity-50 shadow-sm"
              >
                {loadingStock ? 'Đang tra cứu...' : 'Tra cứu'}
              </button>
            </form>

            {stockError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700">
                {stockError}
              </div>
            )}

            {stockInfo && (
              <div className="bg-white border border-[#E8EDE0] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F8F5F0] pb-4">
                  <div className="flex items-center gap-4">
                    <StockLogo ticker={stockInfo.ticker} size="lg" alt={stockInfo.companyName} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-[#2B3A1A] font-mono">{stockInfo.ticker}</h2>
                        <span className="text-xs px-2.5 py-0.5 bg-[#E8F5E0] text-[#3D5226] rounded-full font-bold font-mono">
                          HOSE / HNX
                        </span>
                      </div>
                      <p className="text-sm text-[#7A7060] font-medium mt-0.5">{stockInfo.companyName}</p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-2xl font-bold text-[#3D5226] font-mono">
                      {stockInfo.currentPrice ? stockInfo.currentPrice.toLocaleString('vi-VN') + ' đ' : 'N/A'}
                    </div>
                    <span className="text-xs text-[#7A7060] font-medium">Giá khớp lệnh thị trường</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="p-4 bg-[#F8F5F0]/80 rounded-xl border border-[#E8EDE0]/60">
                    <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wider block mb-1">P/E Ratio</span>
                    <span className="font-bold text-[#2B3A1A] font-mono text-base">{stockInfo.peRatio ? stockInfo.peRatio.toFixed(2) + 'x' : 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-[#F8F5F0]/80 rounded-xl border border-[#E8EDE0]/60">
                    <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wider block mb-1">P/B Ratio</span>
                    <span className="font-bold text-[#2B3A1A] font-mono text-base">{stockInfo.pbRatio ? stockInfo.pbRatio.toFixed(2) + 'x' : 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-[#F8F5F0]/80 rounded-xl border border-[#E8EDE0]/60">
                    <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wider block mb-1">Cao nhất 52 tuần</span>
                    <span className="font-bold text-[#2E7D32] font-mono text-base">{stockInfo.fiftyTwoWeekHigh ? stockInfo.fiftyTwoWeekHigh.toLocaleString('vi-VN') + ' đ' : 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-[#F8F5F0]/80 rounded-xl border border-[#E8EDE0]/60">
                    <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wider block mb-1">Thấp nhất 52 tuần</span>
                    <span className="font-bold text-[#C96B54] font-mono text-base">{stockInfo.fiftyTwoWeekLow ? stockInfo.fiftyTwoWeekLow.toLocaleString('vi-VN') + ' đ' : 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-sm text-[#5A5248]">
                  <div className="flex gap-4 text-xs font-medium text-[#7A7060]">
                    <span>Ngành: <strong className="text-[#2B3A1A]">{stockInfo.industry || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Lĩnh vực: <strong className="text-[#2B3A1A]">{stockInfo.sector || 'N/A'}</strong></span>
                  </div>

                  {stockInfo.summary && (
                    <div className="pt-3 border-t border-[#F8F5F0]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A7060] mb-1.5">Tổng quan doanh nghiệp</h4>
                      <p className="leading-relaxed text-xs text-[#5A5248]">{stockInfo.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DictionaryPage;