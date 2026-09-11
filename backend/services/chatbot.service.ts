import { GoogleGenAI, Type } from '@google/genai';
import Product, { IProduct } from '../models/product.model';
import Category from '../models/category.model';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatResponse {
  text: string;
  products: IProduct[];
  suggestedQuestions?: string[];
  isAiPowered: boolean;
}

export class ChatbotService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0 && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        console.log('[ChatbotService] Google Gemini AI initialized with Function Calling enabled.');
      } catch (err) {
        console.warn('[ChatbotService] Failed to initialize GoogleGenAI client:', err);
      }
    } else {
      console.log('[ChatbotService] No GEMINI_API_KEY found in .env. Running in Smart Rule-Based & DB Search Mode.');
    }
  }

  /**
   * Tool 1: Tìm kiếm đồ uống trong MongoDB theo tiêu chí
   */
  async searchDrinks(params: {
    keyword?: string;
    category?: string;
    maxPrice?: number;
    flavor?: string;
    lowCaffeine?: boolean;
  }): Promise<IProduct[]> {
    const query: any = { isAvailable: { $ne: false } };

    if (params.maxPrice && params.maxPrice > 0) {
      query.price = { $lte: params.maxPrice };
    }

    const searchKeywords: string[] = [];
    if (params.keyword) searchKeywords.push(params.keyword);
    if (params.flavor) searchKeywords.push(params.flavor);

    if (searchKeywords.length > 0) {
      const regexPatterns = searchKeywords.map((kw) => new RegExp(kw.trim(), 'i'));
      query.$or = [
        { name: { $in: regexPatterns } },
        { description: { $in: regexPatterns } },
      ];
    }

    if (params.category) {
      const categories = await Category.find({
        name: { $regex: params.category, $options: 'i' },
      }).lean();
      if (categories.length > 0) {
        const catIds = categories.map((c) => c.id);
        if (query.$or) {
          query.$and = [
            { $or: query.$or },
            { categoryId: { $in: catIds } },
          ];
          delete query.$or;
        } else {
          query.categoryId = { $in: catIds };
        }
      }
    }

    let results = await Product.find(query).limit(6).lean();

    // Nếu lọc quá chặt không có món, nới lỏng tìm kiếm chung
    if (results.length === 0 && searchKeywords.length > 0) {
      const firstKw = searchKeywords[0];
      results = await Product.find({
        isAvailable: { $ne: false },
        $or: [
          { name: { $regex: firstKw, $options: 'i' } },
          { description: { $regex: firstKw, $options: 'i' } },
        ],
      })
        .limit(4)
        .lean();
    }

    return results as IProduct[];
  }

  /**
   * Tool 2: Lấy các món Bestseller / Signature
   */
  async getBestsellers(): Promise<IProduct[]> {
    const signatureIds = ['M101', 'M201', 'M301', 'M104', 'M202'];
    const products = await Product.find({
      id: { $in: signatureIds },
      isAvailable: { $ne: false },
    }).lean();

    if (products.length > 0) {
      return products as IProduct[];
    }

    return (await Product.find({ isAvailable: { $ne: false } }).limit(4).lean()) as IProduct[];
  }

  /**
   * Gợi ý câu hỏi nhanh (Quick Prompts)
   */
  getQuickPrompts(): string[] {
    return [
      'Gợi ý món thanh mát giải nhiệt hôm nay',
      'Có món nào ít ngọt, ít calo cho người ăn kiêng?',
      'Tôi muốn thức đêm làm việc, có món nào tỉnh táo?',
      'Món trà sữa béo ngậy, kem cheese thơm lừng nào ngon nhất?',
      'Top món Best Seller của quán',
    ];
  }

  /**
   * Xử lý tin nhắn khách hàng (LLM + Function Calling hoặc Smart Fallback)
   */
  async processMessage(userMessage: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    const cleanMsg = userMessage.trim();

    // 1. NẾU CÓ CẤU HÌNH GEMINI API KEY -> CHẠY MÔ HÌNH LLM + FUNCTION CALLING
    if (this.ai) {
      try {
        return await this.runGeminiWithTools(cleanMsg, history);
      } catch (error: any) {
        console.error('[ChatbotService] Gemini API call failed, falling back to Smart Engine:', error.message);
      }
    }

    // 2. FALLBACK SMART ENGINE (Mô phỏng Tool Calling chính xác với Database)
    return await this.runSmartFallback(cleanMsg, history);
  }

  /**
   * Gemini 2.5 Flash + Tool Calling
   */
  private async runGeminiWithTools(userMessage: string, history: ChatMessage[]): Promise<ChatResponse> {
    if (!this.ai) throw new Error('AI not configured');

    const searchDrinksTool = {
      name: 'searchDrinks',
      description: 'Tìm kiếm danh sách đồ uống trong menu quán theo từ khóa, danh mục, giá tối đa, hoặc hương vị.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING, description: 'Từ khóa tìm kiếm (nhài, đào, kem cheese, matcha, bánh...)' },
          category: { type: Type.STRING, description: 'Tên nhóm đồ uống (Trà sữa, Kem mây, Trà trái cây, Bánh...)' },
          maxPrice: { type: Type.NUMBER, description: 'Mức giá tối đa mong muốn tính bằng VND' },
          flavor: { type: Type.STRING, description: 'Hương vị hoặc đặc tính (thanh mát, ngọt béo, chua ngọt, đậm đà...)' },
          lowCaffeine: { type: Type.BOOLEAN, description: 'Khách muốn ít hoặc không có caffeine' },
        },
      },
    };

    const getBestsellersTool = {
      name: 'getBestsellers',
      description: 'Lấy danh sách các món đồ uống nổi bật, bán chạy nhất (Best Seller) của quán.',
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    };

    const systemInstruction = `Bạn là Barista Ảo thân thiện, chu đáo và tinh tế của quán "Bồng Biêng Coffee".
Nhiệm vụ của bạn là tư vấn cho khách chọn đồ uống phù hợp với tâm trạng, sở thích hương vị, thời điểm trong ngày và yêu cầu sức khỏe.
QUY TẮC CỐT LÕI:
1. LUÔN LUÔN sử dụng công cụ (Tool) "searchDrinks" hoặc "getBestsellers" để lấy dữ liệu món nước thực tế từ cơ sở dữ liệu trước khi gợi ý. Không bao giờ tự bịa đặt món nước không có trong dữ liệu quán.
2. Trả lời bằng tiếng Việt tự nhiên, ấm áp, lịch sự và ngắn gọn, giải thích lý do vì sao món đó phù hợp với nhu cầu khách hàng.
3. Nếu khách hỏi ngoài phạm vi quán (thời tiết, toán học, chuyện phiếm...), hãy lịch sự chuyển hướng câu chuyện về đồ uống của quán.`;

    const contents: any[] = [];

    // Chuyển đổi history gần nhất (tối đa 4 tin gần nhất)
    history.slice(-4).forEach((h) => {
      contents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [searchDrinksTool, getBestsellersTool] }],
        temperature: 0.7,
      },
    });

    let finalProducts: IProduct[] = [];
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const toolResults: any[] = [];

      for (const call of functionCalls) {
        if (call.name === 'searchDrinks') {
          const args = (call.args as any) || {};
          const prods = await this.searchDrinks(args);
          finalProducts.push(...prods);
          toolResults.push({
            name: call.name,
            response: {
              success: true,
              count: prods.length,
              items: prods.map((p) => ({ id: p.id, name: p.name, price: p.price, description: p.description })),
            },
          });
        } else if (call.name === 'getBestsellers') {
          const best = await this.getBestsellers();
          finalProducts.push(...best);
          toolResults.push({
            name: call.name,
            response: {
              success: true,
              count: best.length,
              items: best.map((p) => ({ id: p.id, name: p.name, price: p.price, description: p.description })),
            },
          });
        }
      }

      // Loại bỏ trùng lặp sản phẩm
      const seen = new Set<string>();
      finalProducts = finalProducts.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      // Gửi kết quả tool call lại cho model để sinh ra câu trả lời tư vấn hoàn chỉnh
      const followUpContents = [
        ...contents,
        response.candidates?.[0]?.content || { role: 'model', parts: [{ text: 'Đang tra cứu menu...' }] },
        {
          role: 'user',
          parts: toolResults.map((tr) => ({
            functionResponse: {
              name: tr.name,
              response: tr.response,
            },
          })),
        },
      ];

      const secondResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...followUpContents,
          {
            role: 'user',
            parts: [
              {
                text: 'Hãy trả lời khách hàng ngắn gọn, ấm áp. Ở cuối câu trả lời, hãy tạo khối phân cách: \n---SUGGESTIONS---\nSau đó liệt kê 4-5 câu hỏi tiếp theo ngắn gọn (mỗi câu 1 dòng) bám sát các món nước vừa được đề xuất (về cách chọn đường/đá, topping ăn kèm, bánh dùng chung, so sánh hương vị) để khách tiếp tục hỏi.',
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      let replyText = secondResponse.text || 'Dưới đây là một số gợi ý phù hợp nhất từ menu của quán dành cho bạn nè!';
      let suggestedQuestions: string[] = [];

      if (replyText.includes('---SUGGESTIONS---')) {
        const parts = replyText.split('---SUGGESTIONS---');
        replyText = parts[0].trim();
        const rawLines = parts[1].trim().split('\n');
        suggestedQuestions = rawLines
          .map((l) => l.replace(/^[\d\.\-\*\•\)]+\s*/, '').trim())
          .filter((l) => l.length > 5 && l.length < 80);
      }

      if (suggestedQuestions.length < 3) {
        suggestedQuestions = this.generateContextualQuestions(userMessage, finalProducts);
      }

      return {
        text: replyText,
        products: finalProducts,
        isAiPowered: true,
        suggestedQuestions,
      };
    }

    return {
      text: response.text || 'Chào bạn! Mình là Barista Ảo. Bạn đang muốn tìm đồ uống có hương vị như thế nào hôm nay?',
      products: finalProducts,
      isAiPowered: true,
      suggestedQuestions: this.generateContextualQuestions(userMessage, finalProducts),
    };
  }

  /**
   * Tạo 4 - 6 câu hỏi gợi ý tiếp theo bám sát ngữ cảnh câu hỏi của khách và các món nước vừa được đề xuất
   */
  generateContextualQuestions(query: string, products: IProduct[] = []): string[] {
    const lower = query.toLowerCase();
    const questions: string[] = [];
    const p1 = products[0]?.name;
    const p2 = products[1]?.name;

    // 1. Ngữ cảnh Thanh mát / Trái cây / Giải nhiệt / Chua ngọt
    if (
      lower.includes('thanh mát') ||
      lower.includes('giải nhiệt') ||
      lower.includes('chua') ||
      lower.includes('trái cây') ||
      lower.includes('đào') ||
      lower.includes('hoa') ||
      lower.includes('mận')
    ) {
      if (p1) questions.push(`Món "${p1}" nên giảm 30% hay 50% đường thì thanh mát nhất?`);
      questions.push('Có topping thạch hoặc trân châu nào ăn kèm giòn giòn không?');
      if (p1 && p2) questions.push(`So sánh hương vị giữa "${p1}" và "${p2}"`);
      questions.push('Uống các món trà này vào buổi tối có sợ mất ngủ không?');
      questions.push('Gợi ý bánh ngọt hoặc bánh sừng bò ăn kèm với trà này');
      questions.push('Món này có tuỳ chọn ít đá hoặc không đá không?');
      return questions.slice(0, 5);
    }

    // 2. Ngữ cảnh Béo ngậy / Kem Cheese / Kem Mây / Trà sữa
    if (
      lower.includes('béo') ||
      lower.includes('ngậy') ||
      lower.includes('cheese') ||
      lower.includes('kem mây') ||
      lower.includes('trà sữa')
    ) {
      questions.push('Lớp kem phô mai/kem mây là vị mặn béo hay ngọt ngậy?');
      if (p1) questions.push(`Món "${p1}" thêm trân châu hay thạch phô mai thì ngon hơn?`);
      questions.push('Nên chọn mức đá và đường thế nào để không bị ngấy?');
      if (p1 && p2) questions.push(`Giữa "${p1}" và "${p2}", món nào đậm vị trà hơn?`);
      questions.push('Có bánh croissant giòn rụm nào ăn kèm món béo này không?');
      questions.push('Nếu mình muốn vị béo vừa phải, thanh hơn thì chọn món nào?');
      return questions.slice(0, 5);
    }

    // 3. Ngữ cảnh Ít calo / Healthy / Giảm cân / Ăn kiêng / Không cafein
    if (
      lower.includes('ít calo') ||
      lower.includes('ít ngọt') ||
      lower.includes('diet') ||
      lower.includes('giảm cân') ||
      lower.includes('healthy') ||
      lower.includes('không cafein')
    ) {
      if (p1) questions.push(`Món "${p1}" chọn 0% đường có bị đắng hay chát không?`);
      questions.push('Quán có dòng sữa hạt hoặc đường ăn kiêng không?');
      questions.push('Topping nào thanh nhẹ ít calo nhất tại quán?');
      questions.push('Có món trà thảo mộc nguyên bản nào giúp thanh lọc cơ thể?');
      questions.push('Gợi ý đồ uống healthy cho ngày mưa hoặc thời tiết se lạnh');
      return questions.slice(0, 5);
    }

    // 4. Ngữ cảnh Tỉnh táo / Làm việc / Học bài / Cà phê / Matcha
    if (
      lower.includes('tỉnh táo') ||
      lower.includes('học bài') ||
      lower.includes('làm việc') ||
      lower.includes('cà phê') ||
      lower.includes('matcha') ||
      lower.includes('đậm')
    ) {
      if (p1) questions.push(`Món "${p1}" độ đậm trà/cà phê có mạnh không, sợ say?`);
      questions.push('Matcha hay Hồng trà sữa giúp giữ sự tập trung làm việc lâu hơn?');
      questions.push('Món này nên dùng kèm bánh gì nhâm nhi khi làm việc?');
      if (p1 && p2) questions.push(`So sánh độ đắng và hương thơm của "${p1}" với "${p2}"`);
      questions.push('Uống vào buổi chiều muộn thì nên chỉnh lượng đá đường ra sao?');
      return questions.slice(0, 5);
    }

    // 5. Ngữ cảnh Best Seller / Bán chạy / Đặc biệt
    if (
      lower.includes('best seller') ||
      lower.includes('ngon nhất') ||
      lower.includes('bán chạy') ||
      lower.includes('chữ ký') ||
      lower.includes('đặc biệt')
    ) {
      questions.push('Món nào là biểu tượng chữ ký đặc sắc nhất của Bồng Biêng?');
      if (p1) questions.push(`Món "${p1}" có gì đặc biệt mà nhiều người gọi vậy?`);
      questions.push('Khách lần đầu đến quán thì nên chọn món nào an toàn, dễ uống?');
      questions.push('Món nào lên hình sống ảo và chụp check-in đẹp mắt nhất?');
      questions.push('Có combo trà kèm bánh bán chạy nhất quán không?');
      return questions.slice(0, 5);
    }

    // 6. Ngữ cảnh Bánh / Ăn kèm
    if (lower.includes('bánh') || lower.includes('pastry') || lower.includes('ăn vặt')) {
      questions.push('Bánh sừng bò (croissant) uống cùng loại trà nào hợp nhất?');
      questions.push('Bánh có được hâm nóng giòn thơm trước khi phục vụ không?');
      questions.push('Combo 1 trà hoa + 1 bánh nào tiết kiệm nhất?');
      questions.push('Có món bánh nào ngọt dịu cho người kiêng đường không?');
      return questions.slice(0, 4);
    }

    // 7. Mặc định theo sản phẩm cụ thể vừa được gợi ý
    if (p1) {
      questions.push(`Món "${p1}" có hương vị chủ đạo là gì?`);
      questions.push(`Mức đường & đá khuyên dùng cho "${p1}" để ngon chuẩn vị?`);
      if (p2) questions.push(`Nên chọn "${p1}" hay "${p2}" nếu mình thích ngọt vừa?`);
      questions.push('Topping nào kết hợp chuẩn bài nhất với món này?');
      questions.push('Quán có món bánh nào dùng kèm để tạo thành combo hoàn hảo?');
      return questions.slice(0, 5);
    }

    // Fallback tổng quát
    return [
      'Gợi ý món thanh mát giải nhiệt hôm nay',
      'Trà sữa béo ngậy kem cheese thơm lừng nào ngon nhất?',
      'Có món nào ít ngọt, ít calo cho người ăn kiêng?',
      'Top món Best Seller đặc sắc nhất của quán',
      'Món nào giúp tỉnh táo tập trung làm việc?',
    ];
  }

  /**
   * Smart Fallback Engine: Thực hiện tự động suy luận ý định và Tool Calling nội bộ theo đúng câu hỏi khách hàng
   */
  private async runSmartFallback(userMessage: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    const lower = userMessage.toLowerCase();
    let products: IProduct[] = [];
    let responseText = '';

    const formatVND = (amount: number): string => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Lấy tất cả sản phẩm trong database để so khớp thông minh (sắp xếp dài trước ngắn sau)
    const allProducts = (await Product.find({ isAvailable: { $ne: false } }).lean()) as IProduct[];
    const sortedAll = [...allProducts].sort((a, b) => b.name.length - a.name.length);

    // Tìm kiếm các món được nhắc đến trực tiếp trong câu hỏi hiện tại
    const mentionedProducts: IProduct[] = [];
    for (const p of sortedAll) {
      const pNameLower = p.name.toLowerCase();
      const pSimpleName = p.name.split('(')[0].trim().toLowerCase();
      const isShortName = pSimpleName.length <= 5;

      const matched = isShortName
        ? new RegExp(`(^|[^\\p{L}\\p{N}])${pSimpleName}([^\\p{L}\\p{N}]|$)`, 'u').test(lower)
        : lower.includes(pNameLower) || lower.includes(pSimpleName);

      if (matched) {
        const alreadyCovered = mentionedProducts.some((mp) =>
          mp.name.toLowerCase().includes(pSimpleName)
        );
        if (!alreadyCovered) {
          mentionedProducts.push(p);
        }
      }
    }

    // =========================================================================
    // ƯU TIÊN 1: HỎI VỀ MẤT NGỦ / SAY / CAFFEINE / BUỔI TỐI (Bắt buộc trả lời trước)
    // =========================================================================
    if (
      lower.includes('mất ngủ') ||
      lower.includes('ngủ được không') ||
      lower.includes('sợ ngủ') ||
      lower.includes('say') ||
      lower.includes('caffeine') ||
      lower.includes('cafein') ||
      lower.includes('buổi tối') ||
      lower.includes('tối nay')
    ) {
      products = (await Product.find({
        categoryId: { $in: ['fresh_fruit', 'tea_flower'] },
        isAvailable: { $ne: false },
      })
        .limit(3)
        .lean()) as IProduct[];

      responseText = `Bạn hoàn toàn yên tâm thưởng thức nhé! Các dòng **Trà Hoa (Thanh Nhài, Mộc Hoa)** và **Trà Trái Cây Tươi (Mận Đào Hoa)** của quán sử dụng hoa tươi tự nhiên ủ lạnh, nồng độ caffeine rất thấp nên không gây cảm giác cồn cào hay mất ngủ như cà phê đậm đâu ạ.\n\nNếu bạn rất nhạy cảm với caffeine vào buổi tối, bạn có thể chọn các món trà trái cây tươi mát dưới đây và dặn chọn mức 30% đường + thêm chút đá nhé:`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // ƯU TIÊN 2: HỎI VỀ BÁNH ĂN KÈM / CROISSANT / PASTRY
    // =========================================================================
    if (
      lower.includes('bánh') ||
      lower.includes('croissant') ||
      lower.includes('sừng bò') ||
      lower.includes('su kem') ||
      lower.includes('ăn kèm') ||
      lower.includes('pastry') ||
      lower.includes('đồ ăn')
    ) {
      products = (await Product.find({ categoryId: 'pastry', isAvailable: { $ne: false } }).lean()) as IProduct[];

      responseText = `Thưởng thức một ly trà thơm cùng một chiếc bánh nướng bơ Pháp nóng giòn là combo chuẩn nhất tại Bồng Biêng luôn ạ! Quán hiện có các món bánh tươi mới mỗi ngày dưới đây, bánh luôn được thợ bánh hâm nóng giòn thơm trước khi phục vụ khách nhé:`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // ƯU TIÊN 3: HỎI VỀ MỨC ĐƯỜNG / ĐỘ NGỌT / MỨC ĐÁ
    // =========================================================================
    if (
      lower.includes('đường') ||
      lower.includes('đá') ||
      lower.includes('mức đường') ||
      lower.includes('độ ngọt') ||
      lower.includes('ít ngọt') ||
      lower.includes('ngọt vừa') ||
      lower.includes('ngọt thanh') ||
      lower.includes('30%') ||
      lower.includes('50%') ||
      lower.includes('0%') ||
      lower.includes('ít đá') ||
      lower.includes('không đá') ||
      lower.includes('mức đá')
    ) {
      // Nếu câu hiện tại chưa có tên món, lấy từ history trước đó
      let targetProduct = mentionedProducts[0];
      if (!targetProduct && history.length > 0) {
        for (let i = history.length - 1; i >= 0; i--) {
          const prevText = history[i].text.toLowerCase();
          const found = allProducts.find((p) => prevText.includes(p.name.toLowerCase()) || prevText.includes(p.name.split('(')[0].trim().toLowerCase()));
          if (found) {
            targetProduct = found;
            break;
          }
        }
      }

      if (targetProduct) {
        products = [targetProduct];
        if (targetProduct.categoryId === 'tea_flower' || targetProduct.categoryId === 'fresh_fruit') {
          responseText = `Dạ với món **${targetProduct.name}**, quán khuyên bạn nên chọn **30% hoặc 50% đường** nhé! Ở mức 30% đường, vị ngọt thanh dịu sẽ làm nổi bật trọn vẹn hương trà và hoa tươi tự nhiên. Nếu bạn chọn mức 0% đường thì trà sẽ hơi chát mộc tự nhiên. Về đá, chọn mức **Ít đá** hoặc **Vừa đá** là mát lạnh chuẩn gu nhất ạ!`;
        } else if (targetProduct.categoryId === 'kem_cheese' || targetProduct.categoryId === 'cloud_cream') {
          responseText = `Dạ với dòng kem béo như món **${targetProduct.name}**, mức **50% đường + Vừa đá** là tỉ lệ vàng được khách gọi nhiều nhất! Mức đường này cân bằng hoàn hảo giữa cốt trà đậm và lớp màng kem béo ngậy, uống không sợ bị ngọt gắt hay quá ngấy đâu ạ.`;
        } else {
          responseText = `Dạ với món **${targetProduct.name}**, bạn có thể tuỳ chọn 30% đường nếu thích thanh nhẹ, hoặc 50% đường nếu thích vị ngọt đượm đà chuẩn công thức quán nhé!`;
        }
      } else {
        responseText = `Về mức đường và đá tại quán:\n• **Dòng Trà Hoa & Trái Cây**: Khuyên dùng **30% - 50% đường** để cảm nhận rõ hương hoa thanh khiết.\n• **Dòng Kem Mây & Kem Cheese**: Khuyên dùng **50% đường** để cân bằng với vị béo ngậy của kem.\n• Bạn có thể chọn **Ít đá** nếu không thích quá lạnh hoặc **0% đường** nếu đang ăn kiêng nhé!`;
        products = await this.getBestsellers();
      }

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // ƯU TIÊN 4: HỎI VỀ TOPPING / TRÂN CHÂU / THẠCH
    // =========================================================================
    if (
      lower.includes('topping') ||
      lower.includes('trân châu') ||
      lower.includes('thạch') ||
      lower.includes('thêm gì')
    ) {
      responseText = `Quán có các loại topping ăn kèm siêu cuốn:\n• **Trân Châu Trắng**: Giòn dai sần sật, hợp nhất khi dùng cùng Trà Trái Cây và Trà Hoa.\n• **Thạch Phô Mai**: Dẻo bùi béo ngậy, cực kỳ hợp với Trà Sữa và Kem Mây.\n• **Màng Kem Cheese**: Béo mặn sánh mịn, có thể gọi thêm cho bất kỳ ly trà nào.\n\nBạn chỉ cần bấm nút **"Chọn món"** ở bất kỳ ly nước nào là có thể thoải mái thêm topping tuỳ thích nhé!`;
      products = mentionedProducts.length > 0 ? mentionedProducts : await this.getBestsellers();

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // ƯU TIÊN 5: SO SÁNH GIỮA 2 MÓN NƯỚC (CHỈ khi người dùng thực sự hỏi so sánh)
    // =========================================================================
    const isComparisonQuery =
      lower.includes('so sánh') ||
      lower.includes('khác gì') ||
      lower.includes('khác nhau') ||
      lower.includes('nên chọn') ||
      lower.includes('hay là') ||
      (lower.includes('hay') && (lower.includes('chọn') || lower.includes('uống') || lower.includes('ngon hơn')));

    if (isComparisonQuery && mentionedProducts.length >= 2) {
      const pA = mentionedProducts[0];
      const pB = mentionedProducts[1];
      products = [pA, pB];

      responseText = `Dạ đây là điểm khác biệt về hương vị giữa 2 món để bạn dễ lựa chọn nè:\n\n` +
        `• 🌿 **${pA.name} (${formatVND(pA.price)})**: ${pA.description || 'Thơm hương tự nhiên, vị thanh mát dễ uống'}.\n` +
        `• ☁️ **${pB.name} (${formatVND(pB.price)})**: ${pB.description || 'Hương vị bồng bềnh, béo ngậy đượm đà'}.\n\n` +
        `👉 **Gợi ý**: Nếu bạn thích sự thanh nhẹ, giải nhiệt thì chọn **${pA.name}**, còn nếu bạn mê vị béo mịn ngọt ngào thì **${pB.name}** là chân ái nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // ƯU TIÊN 6: HỎI CHI TIẾT VỀ 1 MÓN CỤ THỂ
    // =========================================================================
    if (mentionedProducts.length === 1 && !lower.includes('menu') && !lower.includes('quán có gì')) {
      const prod = mentionedProducts[0];
      products = [prod];
      responseText = `Dạ món **${prod.name}** (${formatVND(prod.price)}) là một trong những món rất được khách ưa chuộng tại quán!\n\n` +
        `• **Hương vị**: ${prod.description || 'Hương hoa thơm mát, vị trà ngọt dịu hài hòa'}.\n` +
        `• **Khuyên dùng**: Uống lạnh với mức 30% hoặc 50% đường, có thể thêm trân châu trắng hoặc kem mây.\n\n` +
        `Bạn có muốn thử ngay một ly ${prod.name} hôm nay không nè? Bấm **"Chọn món"** bên dưới để đặt ngay nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: this.generateContextualQuestions(userMessage, products),
      };
    }

    // =========================================================================
    // Ý ĐỊNH: ĂN KIÊNG / GIẢM CÂN / EAT CLEAN / ÍT CALO / HEALTHY / KETO
    // =========================================================================
    if (
      lower.includes('ăn kiêng') ||
      lower.includes('kiêng') ||
      lower.includes('giảm cân') ||
      lower.includes('eat clean') ||
      lower.includes('ít calo') ||
      lower.includes('calo') ||
      lower.includes('diet') ||
      lower.includes('healthy') ||
      lower.includes('giữ dáng') ||
      lower.includes('tiểu đường') ||
      lower.includes('keto')
    ) {
      products = (await Product.find({
        categoryId: { $in: ['fresh_fruit', 'tea_flower'] },
        isAvailable: { $ne: false },
      })
        .limit(3)
        .lean()) as IProduct[];

      responseText =
        `Dạ đối với bạn đang trong chế độ **ăn kiêng, eat clean hoặc kiểm soát calo**, nguyên tắc vàng của Barista là: **hạn chế tối đa chất béo bão hòa từ kem sữa, ưu tiên chất chống oxy hóa từ lá trà mộc và vitamin tự nhiên từ hoa quả tươi**.\n\n` +
        `Quán gợi ý bạn 3 lựa chọn hoàn hảo nhất cho vóc dáng:\n\n` +
        `🌿 **1. Trà Sữa Hoa Nhài - Thanh Nhài (55.000đ)**: Được ủ từ hoa nhài tươi tự nhiên và cốt trà xanh thanh khiết. Nếu bạn chọn **0% hoặc 30% đường**, lượng calo chỉ dao động khoảng **40 - 70 kcal/ly**, hoàn toàn không ảnh hưởng đến quá trình thâm hụt calo.\n\n` +
        `🍹 **2. Trà Trái Cây Tươi - Mận Đào Hoa (65.000đ)**: Cung cấp vitamin C và chất xơ dồi dào từ thịt quả mận và đào tươi giòn. Bạn hãy chọn **30% đường + ít đá**, vị chua thanh tự nhiên của hoa quả sẽ kích thích vị giác mà vẫn cực kỳ lành mạnh.\n\n` +
        `🌸 **3. Mộc Hoa Quế Hoa (55.000đ)**: Hương hoa mộc và quế hoa ngọt dịu tự nhiên ngay cả khi chọn 0% đường, giúp thanh lọc cơ thể và thư giãn tinh thần.\n\n` +
        `💡 **Mẹo Barista dành riêng cho bạn**: Khi bấm **"Chọn món"**, bạn hãy chọn **Mức đường: 0% hoặc 30%** và **không thêm topping ngọt** để đạt hiệu quả giữ dáng tốt nhất nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Món Thanh Nhài 0% đường có bị đắng chát không?',
          'Topping nào ít calo nhất tại quán?',
          'Quán có dùng sữa đặc hay sữa tươi?',
          'Có món bánh nào dành cho người ăn kiêng không?',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: THANH MÁT / GIẢI NHIỆT / CHUA NGỌT / TRÁI CÂY TƯƠI
    // =========================================================================
    if (
      lower.includes('thanh mát') ||
      lower.includes('giải nhiệt') ||
      lower.includes('giải khát') ||
      lower.includes('chua ngọt') ||
      lower.includes('mùa hè') ||
      lower.includes('nóng bức') ||
      lower.includes('trái cây') ||
      lower.includes('hoa quả') ||
      lower.includes('mận') ||
      lower.includes('đào') ||
      lower.includes('xoài') ||
      lower.includes('sen')
    ) {
      products = (await Product.find({
        categoryId: 'fresh_fruit',
        isAvailable: { $ne: false },
      })
        .limit(3)
        .lean()) as IProduct[];

      responseText =
        `Nếu bạn đang cần một ngụm nước xua tan ngay cảm giác oi bức và mệt mỏi thì các dòng **Trà Trái Cây Tươi Tự Nhiên** tại Bồng Biêng là sự lựa chọn số 1!\n\n` +
        `Khác với trà dùng siro công nghiệp thông thường, dòng trà trái cây của quán sử dụng **100% trái cây tươi dầm thủ công** kết hợp cốt trà hoa thanh nhẹ:\n\n` +
        `🍑 **Mận Đào Hoa (65.000đ)**: Cốt trà ướp cánh hoa kết hợp thịt mận giòn sần sật và đào chín thơm nức. Vị chua thanh đầu lưỡi, hậu vị ngọt mát lan tỏa ngay ngụm đầu tiên.\n\n` +
        `🥭 **Thanh Xoài (65.000đ)**: Xoài cát chín vàng ngọt dịu xay nhuyễn mát lạnh, cân bằng tuyệt vời cùng cốt trà thanh khiết.\n\n` +
        `🪷 **Nhân Sen (70.000đ)**: Hạt sen bùi bùi nấu ngọt thanh kết hợp trà mộc truyền thống, vừa mát gan giải nhiệt vừa tốt cho giấc ngủ.\n\n` +
        `👉 **Gợi ý tỉ lệ thưởng thức**: Khuyên bạn chọn **Vừa đá + 50% đường** (hoặc 30% nếu thích chua thanh nhiều hơn), thêm một phần **Trân Châu Trắng giòn** để nhâm nhi cực kỳ đã miệng ạ!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Món Mận Đào Hoa nên giảm bao nhiêu % đường thì ngon?',
          'Uống trà trái cây vào buổi tối có sợ mất ngủ không?',
          'Topping nào hợp nhất với trà trái cây tươi?',
          'Có bánh nào ăn kèm hợp với vị chua ngọt không?',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: BÉO NGẬY / KEM CHEESE / KEM MÂY / TRÀ SỮA ĐẬM ĐÀ
    // =========================================================================
    if (
      lower.includes('béo ngậy') ||
      lower.includes('béo') ||
      lower.includes('ngậy') ||
      lower.includes('kem cheese') ||
      lower.includes('kem mây') ||
      lower.includes('cheese') ||
      lower.includes('phô mai') ||
      lower.includes('thèm béo') ||
      lower.includes('thèm ngọt')
    ) {
      products = (await Product.find({
        categoryId: { $in: ['cloud_cream', 'kem_cheese'] },
        isAvailable: { $ne: false },
      })
        .limit(3)
        .lean()) as IProduct[];

      responseText =
        `Nếu bạn là tín đồ của vị ngọt béo ngậy và hương thơm bồng bềnh thì menu nhà Bồng Biêng có 2 dòng "ngôi sao" khiến bất kỳ ai cũng phải xiêu lòng:\n\n` +
        `☁️ **1. Dòng KEM MÂY - Tiêu biểu: Đào Mây (65.000đ)**:\n` +
        `Lớp kem mây được đánh bông thủ công từ whipping cream cao cấp và sữa tươi béo ngậy, mềm mịn như mây trời và tan ngay khi chạm đầu lưỡi. Cốt trà ô long đào trứng sữa bên dưới vừa thơm lừng vừa ngậy béo êm ái.\n\n` +
        `🧀 **2. Dòng KEM CHEESE - Tiêu biểu: Nhài Cheese (60.000đ)**:\n` +
        `Lớp màng phô mai sánh mịn với vị béo ngậy xen lẫn mằn mặn đặc trưng từ cream cheese New Zealand, kết hợp hoàn hảo cùng cốt trà nhài thanh mát bên dưới, tạo nên độ tương phản hương vị cực kỳ gây nghiện mà không hề bị ngấy.\n\n` +
        `✨ **Nghệ thuật thưởng thức chuẩn Barista**: Bạn đừng dùng ống hút ngay! Hãy nghiêng ly 45 độ để nếm trọn vẹn lớp kem béo mặn trên cùng trước, sau đó mới cắm ống hút để uống hòa quyện cùng cốt trà nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Lớp kem mây và kem cheese khác nhau thế nào?',
          'Nên chọn mức đường đá thế nào để không bị ngấy?',
          'Có món bánh nào ăn kèm hợp với trà kem béo?',
          'Món này thêm trân châu hay thạch phô mai thì ngon hơn?',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: TỈNH TÁO / HỌC BÀI / LÀM VIỆC / CHẠY DEADLINE / CÀ PHÊ / MATCHA
    // =========================================================================
    if (
      lower.includes('tỉnh táo') ||
      lower.includes('học bài') ||
      lower.includes('làm việc') ||
      lower.includes('deadline') ||
      lower.includes('tập trung') ||
      lower.includes('cà phê') ||
      lower.includes('cafe') ||
      lower.includes('matcha') ||
      lower.includes('năng lượng')
    ) {
      products = (await Product.find({
        $or: [{ name: /cà phê/i }, { categoryId: 'cafe_classic' }, { id: 'M105' }, { id: 'M203' }],
        isAvailable: { $ne: false },
      })
        .limit(3)
        .lean()) as IProduct[];

      responseText =
        `Để nạp năng lượng bứt phá sự tập trung và chạy deadline hiệu quả, quán có những lựa chọn tối ưu theo từng cấp độ tỉnh táo:\n\n` +
        `☕ **Cấp độ Tỉnh Táo Tối Đa: Cà Phê Muối Bồng Biêng Special (49.000đ)**:\n` +
        `Cốt cà phê Robusta pha phin truyền thống đậm đà, thơm nồng nàn kết hợp lớp kem muối béo ngậy mằn mặn. Cú hích caffeine mạnh mẽ giúp bạn tỉnh táo tức thì chỉ sau vài ngụm.\n\n` +
        `🍃 **Cấp độ Tỉnh Táo Êm Ái: Hồng Trà Sữa Phong Lan (55.000đ)**:\n` +
        `Được chiết xuất từ lá hồng trà cổ thụ đậm vị, chứa hợp chất L-Theanine tự nhiên giúp kích thích não bộ tập trung cao độ nhưng không gây hiện tượng tim đập nhanh hay cồn cào ruột như khi uống cà phê đen.\n\n` +
        `🥐 **Gợi ý làm việc hiệu quả**: Bạn có thể gọi thêm 1 chiếc **Bánh Sừng Bò Hạnh Nhân** nóng giòn để nhâm nhi cùng, vừa bổ sung năng lượng não bộ vừa duy trì sự tỉnh táo suốt nhiều giờ liền nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Uống vào buổi chiều muộn có sợ mất ngủ không?',
          'Cà phê muối ở đây có bị quá mặn hoặc quá ngọt không?',
          'Gợi ý bánh ngọt ăn kèm lúc học bài',
          'Nên chọn mức đá và đường thế nào?',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: BEST SELLER / MÓN NGON NHẤT / LẦN ĐẦU ĐẾN QUÁN / CHỮ KÝ
    // =========================================================================
    if (
      lower.includes('best seller') ||
      lower.includes('bán chạy') ||
      lower.includes('ngon nhất') ||
      lower.includes('chữ ký') ||
      lower.includes('signature') ||
      lower.includes('lần đầu') ||
      lower.includes('đặc sắc') ||
      lower.includes('nổi tiếng')
    ) {
      products = await this.getBestsellers();

      responseText =
        `Chào bạn đến với thế giới đồ uống của Bồng Biêng Coffee! Nếu đây là lần đầu ghé quán hoặc bạn muốn chọn ngay món chuẩn vị nhất, đây là **Bộ ba Signature làm nên tên tuổi quán**:\n\n` +
        `🌸 **1. Thanh Nhài (Bồng Biêng - 55.000đ) - "Món Quốc Dân"**:\n` +
        `Được mệnh danh là linh hồn của quán. Điểm đặc sắc là hương hoa nhài tươi tự nhiên cực kỳ tao nhã, hòa quyện sữa tươi thơm béo dịu dàng. Uống thanh mát, ngọt dịu, không bị gắt cổ họng hay béo ngậy.\n\n` +
        `☁️ **2. Đào Mây (65.000đ) - "Đỉnh cao Bồng Bềnh"**:\n` +
        `Cốt trà ô long đào trứng sữa thơm ngọt nốt đào mọng, phủ ngọn kem mây mềm mịn bông xốp tan chảy trong khoang miệng. Món này chụp ảnh check-in sống ảo cực kỳ lung linh!\n\n` +
        `🧀 **3. Nhài Cheese (60.000đ) - "Gây nghiện số 1"**:\n` +
        `Sự kết hợp ăn ý giữa trà nhài thanh khiết và lớp màng kem phô mai béo mặn New Zealand. Món này dành cho những ai mê vị béo thơm có chiều sâu.\n\n` +
        `👉 **Khuyên dùng cho người mới**: Hãy bắt đầu bằng **Thanh Nhài (30% đường, vừa đá)** bạn nhé!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Thanh Nhài nên giảm bao nhiêu % đường là ngon nhất?',
          'Món nào chụp ảnh check-in đẹp nhất quán?',
          'Có combo bánh nào ăn cùng Thanh Nhài không?',
          'So sánh vị giữa Thanh Nhài và Đào Mây',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: DẺ CƯỜI ĐỘC QUYỀN
    // =========================================================================
    if (lower.includes('dẻ cười')) {
      products = (await Product.find({ categoryId: 'de_cuoi', isAvailable: { $ne: false } }).lean()) as IProduct[];

      responseText =
        `🌰 **Series Dẻ Cười** là sáng tạo độc quyền và là niềm tự hào của Bồng Biêng trong mùa này!\n\n` +
        `Quán sử dụng hạt dẻ cười nhập khẩu được rang sấy thủ công để giữ trọn vẹn lớp dầu hạt tự nhiên thơm bùi, sau đó xay nhuyễn kết hợp cốt trà hoa thanh tao và sữa béo ngậy:\n\n` +
        `• 🍃 **Thanh (65.000đ)**: Cốt trà nhài thanh mát kết hợp sốt kem dẻ cười thơm lừng, hậu vị bùi béo đọng lại rất lâu trong vòm họng.\n` +
        `• 🌸 **Xuân (70.000đ)**: Phiên bản nâng cấp đậm đà hơn với nốt hương hoa cỏ mùa xuân và lớp topping hạt dẻ cười nướng giòn rụm bên trên.\n\n` +
        `💡 **Gu thưởng thức**: Dành cho những bạn thích đồ uống có độ ngậy tự nhiên từ các loại hạt cao cấp, thơm béo sâu lắng mà không bị ngấy như kem bơ thông thường!`;

      return {
        text: responseText,
        products,
        isAiPowered: false,
        suggestedQuestions: [
          'Món này uống đá hay uống ấm ngon hơn?',
          'Mức đường khuyên dùng cho Series Dẻ Cười?',
          'Có topping nào ăn kèm hợp với dẻ cười không?',
          'Bánh sừng bò ăn kèm món này có hợp không?',
        ],
      };
    }

    // =========================================================================
    // Ý ĐỊNH: LỌC THEO GIÁ TIỀN (VD: dưới 50k, dưới 60k, dưới 70k...)
    // =========================================================================
    const priceMatch = lower.match(/(?:dưới|tầm|khoảng|giá)\s*(\d+)\s*(?:k|nghìn|ngàn|000)/);
    if (priceMatch && priceMatch[1]) {
      let maxP = parseInt(priceMatch[1], 10);
      if (maxP < 1000) maxP = maxP * 1000;
      products = (await Product.find({ price: { $lte: maxP }, isAvailable: { $ne: false } }).limit(4).lean()) as IProduct[];
      if (products.length > 0) {
        responseText =
          `Dạ với tầm giá **dưới ${formatVND(maxP)}**, quán có những món nước chất lượng cao với mức giá cực kỳ êm ái dành cho bạn nè:\n\n` +
          products.map((p) => `• **${p.name}** (${formatVND(p.price)}): ${p.description || 'Hương vị thơm ngon đặc trưng'}`).join('\n') +
          `\n\nBạn có thể bấm **"Chọn món"** ở từng ly để tuỳ chọn đường đá theo sở thích nhé!`;

        return {
          text: responseText,
          products,
          isAiPowered: false,
          suggestedQuestions: this.generateContextualQuestions(userMessage, products),
        };
      }
    }

    // =========================================================================
    // Ý ĐỊNH: TÌM KIẾM THEO TỪ KHÓA TỰ DO HOẶC DEFAULT FALLBACK TƯ VẤN SÂU
    // =========================================================================
    const words = lower.split(/\s+/).filter((w) => w.length > 2);
    if (words.length > 0) {
      const regexArr = words.map((w) => new RegExp(w, 'i'));
      products = (await Product.find({
        isAvailable: { $ne: false },
        $or: [{ name: { $in: regexArr } }, { description: { $in: regexArr } }],
      })
        .limit(4)
        .lean()) as IProduct[];
    }

    if (products.length > 0) {
      responseText =
        `Dạ dựa trên mong muốn **"${userMessage}"** của bạn, Barista xin gợi ý các món nước chuẩn vị nhất dưới đây:\n\n` +
        products.map((p) => `• 🍵 **${p.name}** (${formatVND(p.price)}): ${p.description || 'Đậm đà, thơm dịu, tươi mới mỗi ngày'}.`).join('\n') +
        `\n\nBạn có thể xem chi tiết từng món hoặc bấm vào các câu hỏi gợi ý bên dưới để mình tư vấn thêm về mức đường, mức đá và topping ăn kèm nha!`;
    } else {
      products = await this.getBestsellers();
      responseText =
        `Dạ mình đã lắng nghe nhu cầu của bạn! Tại Bồng Biêng, mỗi ly nước đều được sáng tạo để phù hợp với từng cảm xúc và gu vị riêng biệt:\n\n` +
        `• 🌿 **Nếu bạn thích thanh nhẹ, giải nhiệt, ít calo**: Hãy thử dòng Trà Hoa tự nhiên (Thanh Nhài) hoặc Trà Trái Cây tươi giòn (Mận Đào Hoa).\n` +
        `• ☁️ **Nếu bạn mê vị béo ngọt, đượm đà**: Đừng bỏ qua Đào Mây hay Nhài Cheese với lớp kem phô mai béo mặn sánh mịn.\n` +
        `• ☕ **Nếu bạn cần nạp năng lượng, tỉnh táo**: Cà Phê Muối Special hoặc Hồng Trà đậm vị sẽ là người bạn đồng hành lý tưởng.\n\n` +
        `Dưới đây là một số món signature được yêu thích nhất quán chuẩn bị cho bạn nè! Bạn hãy chia sẻ thêm gu vị cụ thể để mình tư vấn sâu hơn nhé:`;
    }

    return {
      text: responseText,
      products,
      isAiPowered: false,
      suggestedQuestions: this.generateContextualQuestions(userMessage, products),
    };
  }
}

export default new ChatbotService();
