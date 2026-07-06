import { defineTool } from "@lovable.dev/mcp-js";
import { sanityFetch } from "../sanityQuery";

interface SiteSettings {
  title?: string;
  description?: string;
  contactNumber?: string;
}

export default defineTool({
  name: "get_center_info",
  title: "Get center info",
  description:
    "Get key facts about the 부천 동백 장애인활동지원센터 (Dongbaek Personal Assistance Service Center, Bucheon): what it does, address, phone, hours, services, and how to use them.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    let settings: SiteSettings | null = null;
    try {
      settings = await sanityFetch<SiteSettings>(
        `*[_type == "siteSettings"][0]{ title, description, contactNumber }`,
      );
    } catch {
      settings = null;
    }

    const info = {
      name: "부천의료복지사회적협동조합 동백 장애인활동지원센터",
      englishName: "Dongbaek Personal Assistance Service Center (Bucheon)",
      description:
        settings?.description ??
        "부천의료복지사회적협동조합 산하의 장애인활동지원 전문 기관으로, 일상생활이 어려운 장애인에게 활동지원서비스를 제공하여 자립생활을 돕습니다.",
      serviceType: "장애인활동지원서비스 (국민연금공단 지정 기관)",
      address: "경기도 부천시 원미로97번길 31 3층 (우편번호 14548)",
      phone: settings?.contactNumber ?? "032-675-7517",
      fax: "032-675-7518",
      email: "dong100@naver.com",
      website: "https://dong100.org",
      kakaoChannel: '카카오톡 채널 "동백 장애인활동지원센터" 검색',
      hours: "평일 09:00~18:00 (주말·공휴일 휴무)",
      eligibility: "만 6세 이상 65세 미만 등록 장애인 중 국민연금공단 활동지원 수급자격 인정자",
      services: [
        "신체 활동 지원 (식사, 배설, 목욕, 이동 등)",
        "가사 활동 지원 (청소, 세탁, 취사 등)",
        "사회 활동 지원 (외출·병원·관공서 동행 등)",
        "방문 목욕 서비스",
        "방문 간호 서비스",
        "활동지원사 모집 및 교육",
      ],
      howToApply: [
        "국민연금공단 관할 지사 방문하여 활동지원급여 신청",
        "공단 방문 조사 (서비스 필요도 평가)",
        "수급 자격 및 급여량 결정",
        "동백 센터 방문하여 이용 계약 및 활동지원사 매칭",
        "서비스 이용 시작",
      ],
    };

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
