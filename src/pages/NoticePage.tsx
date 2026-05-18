import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { sanityClient, type SanityNotice } from "@/lib/sanity";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fetchNotices = async (): Promise<SanityNotice[]> => {
  return sanityClient.fetch(
    `*[_type == "notice"] | order(important desc, publishedAt desc) {
      _id, title, publishedAt, important, coverImage
    }`
  );
};

const NoticePage = () => {
  const { data: notices = [], isLoading, error } = useQuery({
    queryKey: ["sanity-notices"],
    queryFn: fetchNotices,
    staleTime: 1000 * 60,
  });

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container py-8 md:py-12">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-lg hover:bg-accent" aria-label="홈으로">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">📢 공지사항</h1>
            <p className="text-sm text-muted-foreground mt-1">센터의 주요 소식과 안내사항을 확인하세요.</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-5"><Skeleton className="h-5 w-3/4" /></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">불러오기 실패</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">등록된 공지가 없습니다.</div>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {notices.map((n) => (
                <li key={n._id}>
                  <Link
                    to={`/notice/${n._id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors"
                  >
                    {n.important && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded">
                        <AlertCircle size={12} /> 중요
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base md:text-lg truncate">{n.title}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(n.publishedAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NoticePage;
