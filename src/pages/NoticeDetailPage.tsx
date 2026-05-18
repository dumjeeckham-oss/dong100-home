import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, AlertCircle } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { urlFor, fetchNotice } from "@/lib/sanity";
import { portableComponents } from "@/components/portableComponents";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NoticeDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { data: notice, isLoading, error } = useQuery({
    queryKey: ["sanity-notice", id],
    queryFn: () => fetchNotice(id),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container py-8 md:py-12 max-w-3xl">
        <Link to="/notice" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> 목록으로
        </Link>

        <article className="bg-card rounded-2xl shadow-sm p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          ) : error || !notice ? (
            <div className="text-center py-10 text-muted-foreground">공지를 찾을 수 없습니다.</div>
          ) : (
            <>
              <header className="border-b border-border pb-4 mb-6">
                {notice.important && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded mb-2">
                    <AlertCircle size={12} /> 중요
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold leading-snug">{notice.title}</h1>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(notice.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </header>
              {notice.coverImage && (
                <img
                  src={urlFor(notice.coverImage).width(1200).url()}
                  alt={notice.title}
                  className="rounded-lg mb-6 w-full h-auto"
                />
              )}
              <div className="prose prose-sm md:prose-base max-w-none text-foreground">
                {notice.content ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <PortableText value={notice.content as any} components={portableComponents} />
                ) : (
                  <p className="text-muted-foreground">내용이 없습니다.</p>
                )}
              </div>
            </>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NoticeDetailPage;
