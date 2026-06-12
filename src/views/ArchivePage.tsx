import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Download, FileText } from "lucide-react";
import { sanityClient, fileUrl, formatBytes, fetchArchives, type SanityArchive } from "@/lib/sanity";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArchivePage = () => {
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["sanity-archives"],
    queryFn: fetchArchives,
    staleTime: 1000 * 60,
  });

  const getDownloadUrl = (item: SanityArchive) =>
    item.file?.asset?.url || fileUrl(item);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container py-8 md:py-12">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-lg hover:bg-accent" aria-label="홈으로">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">📁 서식 자료실</h1>
            <p className="text-sm text-muted-foreground mt-1">필요한 서류와 양식을 다운로드하세요.</p>
          </div>
        </div>

        {/* Desktop: table / Mobile: cards */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">불러오기 실패</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">등록된 자료가 없습니다.</div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden md:table w-full" aria-label="자료실 목록">
                <thead className="bg-muted/60 text-sm text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">제목</th>
                    <th className="text-left px-5 py-3 font-medium w-56">파일명</th>
                    <th className="text-left px-5 py-3 font-medium w-24">크기</th>
                    <th className="text-left px-5 py-3 font-medium w-32">작성일</th>
                    <th className="text-right px-5 py-3 font-medium w-32">다운로드</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((it) => {
                    const url = getDownloadUrl(it);
                    const fname = it.file?.asset?.originalFilename || `${it.title}.${it.file?.asset?.extension || "file"}`;
                    return (
                      <tr key={it._id} className="hover:bg-accent/30">
                        <td className="px-5 py-4">
                          <Link to={`/archive/${it._id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {it.title}
                          </Link>
                          {it.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{it.description}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground truncate max-w-[14rem]">
                          <span className="inline-flex items-center gap-1.5">
                            <FileText size={14} /> {fname}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{formatBytes(it.file?.asset?.size)}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {it.publishedAt ? new Date(it.publishedAt).toLocaleDateString("ko-KR") : ""}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {url ? (
                            <a href={url} download={fname} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="gap-1.5"><Download size={14} /> 다운로드</Button>
                            </a>
                          ) : (
                            <Link to={`/archive/${it._id}`}>
                              <Button size="sm" variant="outline">자세히</Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="md:hidden divide-y divide-border" role="list">
                {items.map((it) => {
                  const url = getDownloadUrl(it);
                  const fname = it.file?.asset?.originalFilename || `${it.title}.${it.file?.asset?.extension || "file"}`;
                  return (
                    <li key={it._id} className="p-4 space-y-2">
                      <Link to={`/archive/${it._id}`} className="block font-semibold text-base hover:text-primary">
                        {it.title}
                      </Link>
                      {it.description && <p className="text-sm text-muted-foreground line-clamp-2">{it.description}</p>}
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                        {url && <span className="inline-flex items-center gap-1"><FileText size={12} />{fname}</span>}
                        {it.file?.asset?.size && <span>{formatBytes(it.file.asset.size)}</span>}
                        <span className="inline-flex items-center gap-1"><Calendar size={12} />{it.publishedAt ? new Date(it.publishedAt).toLocaleDateString("ko-KR") : ""}</span>
                      </div>
                      {url ? (
                        <a href={url} download={fname} target="_blank" rel="noopener noreferrer" className="block">
                          <Button size="sm" className="w-full gap-1.5 mt-1"><Download size={14} /> 다운로드</Button>
                        </a>
                      ) : (
                        <Link to={`/archive/${it._id}`} className="block">
                          <Button size="sm" variant="outline" className="w-full mt-1">자세히 보기</Button>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchivePage;
