import { defineMcp } from "@lovable.dev/mcp-js";
import listNotices from "./tools/list-notices";
import searchFaq from "./tools/search-faq";
import listArchives from "./tools/list-archives";
import getCenterInfo from "./tools/get-center-info";

export default defineMcp({
  name: "dongbaek-center-mcp",
  title: "동백 장애인활동지원센터 MCP",
  version: "0.1.0",
  instructions:
    "Public tools for the 부천 동백 장애인활동지원센터 (Dongbaek Personal Assistance Service Center, Bucheon). Use `get_center_info` for facts about the center (address, phone, hours, services, how to apply), `list_notices` for the latest announcements, `search_faq` to answer common questions, and `list_archives` for downloadable forms and reference documents.",
  tools: [getCenterInfo, listNotices, searchFaq, listArchives],
});
