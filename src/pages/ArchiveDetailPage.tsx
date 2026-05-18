import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Download, FileText } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { fileUrl, formatBytes, fetchArchive } from "@/lib/sanity";
import { portableComponents } from "@/components/portableComponents";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArchiveDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { data: item, isLoading, error } = useQuery({
    queryKey: ["sanity-archive", id],
    queryFn: () => fetchArchive(id),
    enabled: !!id,
  });

  const url = item?.file?.asset?.url || fileUrl(item?.file?.asset?._ref);
  const fname = item?.file?.asset?.originalFilename || `${item?.title || "file"}.${item?.file?.asset?.extension || "file"}`;

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container py-8 md:py-12 max-w-3xl">
        <Link to="/archive" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> 목록으로
        </Link>

        <article className="bg-card rounded-2xl shadow-sm p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          ) : error || !item ? (
            <div className="text-center py-10 text-muted-foreground">자료를 찾을 수 없습니다.</div>
          ) : (
            <>
              <header className="border-b border-border pb-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold leading-snug">{item.title}</h1>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(item.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
              </header>

              {item.body ? (
                <div className="prose prose-sm md:prose-base max-w-none text-foreground mb-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <PortableText value={item.body as any} components={portableComponents} />
                </div>
              ) : null}

              {url && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <FileText size={18} className="text-primary shrink-0" />
                    <span className="font-medium truncate">{fname}</span>
                    {item.file?.asset?.size && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({formatBytes(item.file.asset.size)})
                      </span>
                    )}
                  </div>
                  <a href={url} download={fname} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1.5"><Download size={14} /> 다운로드</Button>
                  </a>
                </div>
              )}
            </>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArchiveDetailPage;
