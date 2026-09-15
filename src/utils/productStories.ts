import type { Product } from '../types';

export interface ProductStoryDetail {
  story: string;
  origin: string;
  servingSuggestion: string;
  aromaNotes: string[];
}

const SPECIFIC_STORIES: Record<string, ProductStoryDetail> = {
  // P101 - Song Nhài Signature
  P101: {
    story: `Giữa những ồn ào vội vã của phố thị, Song Nhài Bông Biêng mang đến một khoảng lặng đượm hương đồng nội. Cốt trà nhài được thu hái từ những búp trà xanh ô long trên ngọn núi cao phủ sương mờ. Cứ mỗi độ hoàng hôn buông xuống, những đóa hoa nhài trắng muốt ngát hương được tỉ mỉ ướp cùng cốt trà suốt 6 tiếng thấu đêm.\n\nSự giao thoa tinh tế giữa vị chát dịu thanh tao của trà mộc và hương thơm ngạt ngào tự nhiên của hoa tươi tạo nên ngụm trà mát lành, sâu đắng đượm ngọt, đọng lại mãi nơi đầu lưỡi của người thưởng thức.`,
    origin: 'Trà xanh Ô long núi cao Bảo Lộc & Hoa nhài tươi Huế ướp lạnh 6 tiếng thấu đêm.',
    servingSuggestion: 'Uống lạnh với mức đá 50%, thưởng thức từng ngụm chậm rãi để cảm nhận vị ngọt hậu kéo dài.',
    aromaNotes: ['Hương hoa nhài tươi', 'Vị chát dịu thanh tao', 'Hậu vị ngọt sâu'],
  },

  // P01 - Cà Phê Muối
  P01: {
    story: `Cà Phê Muối Bông Biêng là bản hòa tấu trầm ấm giữa đất trời Tây Nguyên và ngọn gió biển khơi. Cốt cà phê Espresso được chiết xuất từ những hạt Robusta chín đỏ mọng rang mộc thủ công tại cao nguyên Đắk Lắk. Phủ lên trên là lớp màng kem muối biển mềm mịn như mây, béo ngậy mà mặn mòi.\n\nNhấp một ngụm, vị mặn nhẹ ban đầu tan chảy nhường chỗ cho vị ngậy béo của kem tươi, rồi bừng nở vị đắng quyến rũ đậm đà của cà phê nguyên bản – một trải nghiệm vị giác đầy mê đắm và khó quên.`,
    origin: '100% Hạt cà phê Robusta chín cây Đắk Lắk rang mộc & Kem muối biển Sa Huỳnh.',
    servingSuggestion: 'Không nên khuấy quá tan, hãy uống trực tiếp từ mép ly để cảm nhận sự phân tầng độc đáo giữa kem mặn và cà phê đắng.',
    aromaNotes: ['Vị mặn kem biển', 'Vị đắng đượm Robusta', 'Độ béo ngậy mượt mà'],
  },

  // P04 - Cà Phê Trứng Hà Nội
  P04: {
    story: `Lấy cảm hứng từ nét văn hóa cổ kính của phố cổ Hà Thành, Cà Phê Trứng Bông Biêng gợi nhớ về những ký ức hoài niệm ấm áp. Lòng đỏ trứng gà tươi nguyên chất được đánh bông mịn màng cùng chút sữa đặc và mật ong rừng, tạo nên lớp màng kem trứng bồng bềnh vàng ươm thơm lừng không chút vị tanh.\n\nKhi rót dòng Espresso rang đậm nóng hổi vào giữa tách, tách cà phê chia thành hai tầng sương khói ấm áp. Vị ngậy béo mềm mượt quyện chặt vào lớp cà phê đắng thơm nồng nàn, cho bạn cảm giác như đang thưởng thức một món quà ngọt ngào giữa ngày đông.`,
    origin: 'Lòng đỏ trứng gà tươi theo chuẩn nông trại, Mật ong rừng Mộc Châu & Espresso Đắk Lắk.',
    servingSuggestion: 'Thưởng thức khi còn ấm nóng hoặc dùng thìa xúc lớp kem trứng đánh bông trước khi uống cốt cà phê.',
    aromaNotes: ['Kem trứng đánh bông', 'Hương mật ong rừng', 'Cà phê Espresso nóng'],
  },

  // P05 - Trà Ô Long Trái Cây Nhiệt Đới
  P05: {
    story: `Như một làn gió nhiệt đới tươi mát thổi qua ngày hè rực nắng, Trà Ô Long Trái Cây mang lại sự bừng tỉnh sảng khoái cho từng giác quan. Cốt trà Ô long đượm hương nướng than củi thanh nhã hòa quyện ngào ngạt cùng mứt xoài chín vàng, dứa tươi mọng nước và từng lát chanh vàng thơm nồng.\n\nNgụm trà đầu tiên mang vị chua ngọt tự nhiên bung tỏa, hòa cùng vị chát nhẹ đượm hậu của lá trà Ô long, tạo nên dư vị sảng khoái dâng trào khó cưỡng.`,
    origin: 'Lá trà Ô long nướng than củi Lâm Đồng & Trái cây tươi chín mộng nhiệt đới.',
    servingSuggestion: 'Uống kèm đá lạnh vừa phải, ăn cùng thạch tuyết đào để nhân đôi độ sảng khoái.',
    aromaNotes: ['Trà Ô long nướng', 'Xoài & dứa chín mộng', 'Chua ngọt tươi mát'],
  },

  // P102 - Thanh Nhài Kem Mây Bơ
  P102: {
    story: `Sự kết hợp đầy ngẫu hứng giữa nền trà nhài ủ lạnh thanh mỏng và lớp ngọn kem mây bơ béo mịn. Từng thìa bơ sáp chín dẻo Dalat được xay nhuyễn kết hợp với kem tươi đánh bông mềm mại, tạo thành dải mây bơ bồng bềnh nằm êm đềm trên làn nước trà xanh mát.\n\nHương thơm dịu dàng của hoa nhài len lỏi qua vị béo ngậy mượt mà của bơ tươi, tạo nên một nốt nhạc vô cùng ngọt ngào và thơ mộng.`,
    origin: 'Bơ sáp dẻo Đơn Dương (Lâm Đồng) & Cốt trà nhài ướp hoa tươi thấu đêm.',
    servingSuggestion: 'Dùng ống hút hút từng ngụm trà nhài quyện cùng dải kem mây bơ mềm mịn.',
    aromaNotes: ['Bơ sáp chín dẻo', 'Kem mây bồng bềnh', 'Hương trà nhài thanh tao'],
  },

  // P08 - Trà Sữa Ô Long Nướng
  P08: {
    story: `Được chắt lọc từ những lá trà Ô long thượng hạng trải qua quá trình nướng trên than củi trầm lắng, tách trà sữa sở hữu dải hương nướng nồng nàn độc đáo. Kết hợp cùng dòng sữa tươi Dalatmilk thanh trùng và trân châu đường đen dẻo quánh nấu thủ công suốt 2 giờ.\n\nNgụm trà đậm đà, vị béo ngậy hài hòa mà không hề gắt, đọng lại dải hương trà nướng thơm lừng đầy lưu luyến.`,
    origin: 'Trà Ô long nướng thủ công trên than củi & Trân châu đường đen dẻo thơm.',
    servingSuggestion: 'Thêm trân châu tuyết hoa và thưởng thức với mức đường 70% để cảm nhận vị trà nướng rõ nhất.',
    aromaNotes: ['Hương trà nướng than', 'Sữa tươi Dalatmilk', 'Trân châu đường đen'],
  },

  // P03 - Bạc Xỉu Kem Bơ
  P03: {
    story: `Dành cho những tâm hồn yêu thích sự ngọt ngào êm dịu, Bạc Xỉu Kem Bơ là sự hòa quyện hoàn hảo giữa nhiều dòng sữa tươi thanh trùng và chút cà phê phin nguyên chất thơm dịu. Điểm nhấn độc đáo là lớp kem bơ dẻo quánh béo mượt phủ trên cùng.\n\nNhấp một ngụm, cảm giác mượt mà êm ái như dải lụa lan tỏa khắp vòm họng, xua tan mọi mệt mỏi căng thẳng trong ngày.`,
    origin: 'Sữa tươi thanh trùng Dalatmilk, Bơ sáp dẻo ngậy & Cà phê phin Robusta.',
    servingSuggestion: 'Khuấy nhẹ lớp kem bơ với bạc xỉu và dùng kèm với đá lạnh.',
    aromaNotes: ['Bạc xỉu êm dịu', 'Kem bơ ngậy dẻo', 'Hương cà phê dịu nhẹ'],
  },
};

export const getProductStoryDetail = (product: Product): ProductStoryDetail => {
  const fallback = SPECIFIC_STORIES[product.id];

  // Story: product.story > product.description > fallback
  const storyText = product.story || (product.description && product.description.length > 25 ? product.description : null) || (fallback ? fallback.story : product.description) || `Món "${product.name}" là một kiệt tác pha chế của Bồng Biêng, được tạo nên từ nguyên liệu tự nhiên chắt lọc tinh tế. Từng ngụm thưởng thức mang đến sự hòa quyện tuyệt vời giữa hương thơm dịu nhẹ nguyên bản và cấu trúc vị giác đa tầng.`;

  // Origin: product.origin > fallback
  const originText = product.origin || (fallback ? fallback.origin : 'Nguyên liệu chọn lọc tự nhiên theo tiêu chuẩn pha chế đặc quyền của Bồng Biêng.');

  // Serving Suggestion: product.servingSuggestion > fallback
  const servingText = product.servingSuggestion || (fallback ? fallback.servingSuggestion : 'Nên thưởng thức ngay khi vừa pha chế để giữ trọn vẹn hương vị độc đáo nhất.');

  // Aroma Notes: product.aromaNotes > fallback
  const notes = (product.aromaNotes && product.aromaNotes.length > 0)
    ? product.aromaNotes
    : (fallback ? fallback.aromaNotes : ['Hương vị tự nhiên', 'Nguyên liệu chọn lọc', 'Dư vị thanh mỏng']);

  return {
    story: storyText,
    origin: originText,
    servingSuggestion: servingText,
    aromaNotes: notes,
  };
};
