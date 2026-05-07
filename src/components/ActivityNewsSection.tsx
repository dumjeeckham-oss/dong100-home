import { useQuery } from "@tanstack/react-query";
import { Calendar, Newspaper } from "lucide-react";
import { sanityClient, urlFor, type SanityPost } from "@/lib/sanity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchActivityPosts = async (): Promise<SanityPost[]> => {
  return sanityClient.fetch(
    `*[_type == "post" && category == "activity"] | order(date desc) [0...9] {
      _id, title, content, date, image, category
    }`
  );
};

const formatDate = (s?: string) => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
};

const ActivityNewsSection = () => {
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ["sanity", "activity"],
    queryFn: fetchActivityPosts,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section id="activity-news" className="py-12 md:py-16 bg-background" aria-label="활동 소식">
      <div className="container">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Newspaper className="text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">활동 소식</h2>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-40 w-full rounded-t-lg" />
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-muted-foreground">
            소식을 불러오지 못했습니다. Sanity 프로젝트 ID와 CORS 설정을 확인해주세요.
          </p>
        )}

        {items && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map((item) => (
              <Card key={item._id} className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                {item.image && (
                  <img
                    src={urlFor(item.image).width(800).height(400).fit("crop").auto("format").url()}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-lg leading-snug line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Calendar size={14} />
                    <time>{formatDate(item.date)}</time>
                  </div>
                  {item.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                      {item.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {items && items.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground">등록된 활동 소식이 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default ActivityNewsSection;
