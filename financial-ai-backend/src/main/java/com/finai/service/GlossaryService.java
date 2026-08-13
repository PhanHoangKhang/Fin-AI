package com.finai.service;

import com.finai.dto.GlossaryDto;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GlossaryService {

    private final List<GlossaryDto> mockGlossary = new ArrayList<>();

    @PostConstruct
    public void initData() {
        mockGlossary.add(GlossaryDto.builder()
                .id("rsi")
                .term("RSI")
                .fullName("Relative Strength Index (Chỉ số Sức mạnh Tương đối)")
                .category("PHAN_TICH_KY_THUAT")
                .categoryName("Phân tích kỹ thuật")
                .shortDefinition("Chỉ báo đo lường tốc độ và sự thay đổi của biến động giá trên thang điểm từ 0 đến 100.")
                .fullDefinition("RSI dùng để xác định trạng thái quá mua (Overbought - trên 70) hoặc quá bán (Oversold - dưới 30) của một cổ phiếu.")
                .example("Mã SSI có RSI = 28, cho thấy lực bán quá đà và cổ phiếu bước vào vùng quá bán.")
                .firstLetter("R")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("pe")
                .term("P/E")
                .fullName("Price to Earnings Ratio (Hệ số Giá / Lợi nhuận)")
                .category("CHUNG_KHOAN_CO_BAN")
                .categoryName("Chứng khoán cơ bản")
                .shortDefinition("Đánh giá mối quan hệ giữa giá thị trường của cổ phiếu và lợi nhuận trên một cổ phiếu (EPS).")
                .fullDefinition("Chỉ số P/E thể hiện nhà đầu tư sẵn sàng trả bao nhiêu tiền cho 1 đồng lợi nhuận của doanh nghiệp.")
                .example("HPG có P/E = 8x, thấp hơn trung bình ngành thép là 12x, cho thấy định giá đang tương đối rẻ.")
                .firstLetter("P")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("pb")
                .term("P/B")
                .fullName("Price to Book Ratio (Hệ số Giá / Giá trị sổ sách)")
                .category("CHUNG_KHOAN_CO_BAN")
                .categoryName("Chứng khoán cơ bản")
                .shortDefinition("So sánh giá thị trường của cổ phiếu với giá trị sổ sách trên mỗi cổ phiếu.")
                .fullDefinition("Chỉ số P/B giúp nhà đầu tư xác định xem giá cổ phiếu đang đắt hay rẻ so với tài sản ròng của công ty.")
                .example("MBB có P/B = 0.9x, tức là cổ phiếu đang giao dịch dưới giá trị sổ sách.")
                .firstLetter("P")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("macd")
                .term("MACD")
                .fullName("Moving Average Convergence Divergence")
                .category("PHAN_TICH_KY_THUAT")
                .categoryName("Phân tích kỹ thuật")
                .shortDefinition("Chỉ báo xu hướng động lượng cho biết mối quan hệ giữa hai đường trung bình động (EMA).")
                .fullDefinition("Gồm đường MACD và đường Signal. Khi MACD cắt lên Signal, đó là tín hiệu Mua.")
                .example("Đường MACD của VND cắt lên đường Signal trên khung D1, phát tín hiệu đảo chiều tăng giá.")
                .firstLetter("M")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("eps")
                .term("EPS")
                .fullName("Earnings Per Share (Lợi nhuận trên mỗi cổ phiếu)")
                .category("BAO_CAO_TAI_CHINH")
                .categoryName("Báo cáo tài chính")
                .shortDefinition("Phần lợi nhuận ròng sau thuế phân bổ cho mỗi cổ phiếu đang lưu hành.")
                .fullDefinition("EPS thể hiện khả năng sinh lời của doanh nghiệp. EPS càng cao chứng tỏ công ty hoạt động càng hiệu quả.")
                .example("FPT đạt EPS năm gần nhất là 4,500 VND/cổ phiếu, tăng trưởng 20% so với cùng kỳ.")
                .firstLetter("E")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("margin")
                .term("Margin")
                .fullName("Giao dịch ký quỹ (Vay Margin)")
                .category("CHUNG_KHOAN_CO_BAN")
                .categoryName("Chứng khoán cơ bản")
                .shortDefinition("Sử dụng khoản vay từ công ty chứng khoán để mua nhiều cổ phiếu hơn số vốn thực có.")
                .fullDefinition("Tỷ lệ đòn bẩy gia tăng lợi nhuận khi thị trường tăng, nhưng cũng gia tăng rủi ro khi giảm giá mạnh.")
                .example("Tỷ lệ Margin 1:1 cho phép nhà đầu tư dùng 100 triệu tiền có sẵn để mua 200 triệu tiền cổ phiếu.")
                .firstLetter("M")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("atc")
                .term("ATC")
                .fullName("At The Close (Lệnh giao dịch tại mức giá đóng cửa)")
                .category("CHUNG_KHOAN_CO_BAN")
                .categoryName("Chứng khoán cơ bản")
                .shortDefinition("Lệnh đặt mua/bán cổ phiếu tại mức giá đóng cửa trong phiên khớp lệnh định hình cuối ngày.")
                .fullDefinition("Lệnh ATC được ưu tiên khớp trước lệnh giới hạn (LO). Nếu không khớp được trong phiên ATC, lệnh tự bị hủy.")
                .example("Nhiều quỹ ETF đặt lệnh ATC vào phiên cơ cấu danh mục để mua/bán cổ phiếu.")
                .firstLetter("A")
                .build());

        mockGlossary.add(GlossaryDto.builder()
                .id("lsdh")
                .term("Lãi suất điều hành")
                .fullName("Lãi suất chính sách do Ngân hàng Nhà nước ấn định")
                .category("VI_MO")
                .categoryName("Vĩ mô")
                .shortDefinition("Công cụ chính sách tiền tệ để điều tiết thanh khoản và lạm phát.")
                .fullDefinition("Bao gồm Lãi suất tái cấp vốn và Tái chiết khấu. Hạ lãi suất giúp bơm thanh khoản hỗ trợ nền kinh tế.")
                .example("NHNN hạ lãi suất điều hành 0.5%, dòng tiền cá nhân quay trở lại kênh chứng khoán.")
                .firstLetter("L")
                .build());
    }

    public List<GlossaryDto> getAllGlossary(String keyword, String category, String letter) {
        return mockGlossary.stream()
                .filter(item -> {
                    boolean matchKeyword = true;
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        String q = keyword.toLowerCase().trim();
                        matchKeyword = (item.getTerm() != null && item.getTerm().toLowerCase().contains(q))
                                || (item.getFullName() != null && item.getFullName().toLowerCase().contains(q))
                                || (item.getShortDefinition() != null && item.getShortDefinition().toLowerCase().contains(q));
                    }

                    boolean matchCategory = true;
                    if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
                        matchCategory = category.equalsIgnoreCase(item.getCategory());
                    }

                    boolean matchLetter = true;
                    if (letter != null && !letter.trim().isEmpty()) {
                        String firstChar = item.getFirstLetter() != null ? item.getFirstLetter() : String.valueOf(item.getTerm().charAt(0));
                        matchLetter = firstChar.equalsIgnoreCase(letter.trim());
                    }

                    return matchKeyword && matchCategory && matchLetter;
                })
                .collect(Collectors.toList());
    }

    public GlossaryDto getGlossaryById(String id) {
        return mockGlossary.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }
}