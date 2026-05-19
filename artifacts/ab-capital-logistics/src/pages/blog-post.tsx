import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "./blog";

interface BlogPostProps {
  params: { slug?: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  const slug = params?.slug || "";
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Article Not Found</h1>
          <Link href="/blog" data-testid="link-back-blog">
            <Button className="bg-accent hover:bg-accent/90 text-white">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.indexOf(post);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const related = blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 2);

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary pt-40 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${post.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-accent hover:text-accent/80 mb-6 font-medium" data-testid="link-back-blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{post.title}</h1>
          <div className="flex items-center gap-5 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <article className="lg:col-span-3 prose prose-lg max-w-none" data-testid="article-content">
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold text-primary mt-8 mb-4">{para.replace("## ", "")}</h2>;
                }
                if (para.startsWith("**") && para.endsWith("**")) {
                  return <h3 key={i} className="text-lg font-bold text-primary mt-6 mb-3">{para.replace(/\*\*/g, "")}</h3>;
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter(l => l.startsWith("- "));
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2 mb-4">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-600">{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>;
              })}

              {/* Navigation */}
              <div className="border-t border-gray-100 mt-12 pt-8 flex justify-between gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="flex-1" data-testid="link-prev-post">
                    <div className="group flex items-start gap-3 text-left">
                      <ArrowLeft className="w-4 h-4 text-gray-400 mt-1 group-hover:text-accent transition-colors" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Previous</p>
                        <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{prevPost.title}</p>
                      </div>
                    </div>
                  </Link>
                ) : <div />}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} className="flex-1 text-right" data-testid="link-next-post">
                    <div className="group flex items-end gap-3 justify-end">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Next</p>
                        <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{nextPost.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-1 group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA */}
                <div className="bg-primary rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-3">Need Logistics Help?</h3>
                  <p className="text-gray-300 text-sm mb-5">Our experts are ready to assist with your freight requirements.</p>
                  <Link href="/quote" data-testid="link-sidebar-quote">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white text-sm">Get a Quote</Button>
                  </Link>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div>
                    <h3 className="font-bold text-primary mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} data-testid={`link-related-${r.slug}`}>
                          <div className="group">
                            <img src={r.image} alt={r.title} className="w-full h-24 object-cover rounded-lg mb-3 group-hover:opacity-80 transition-opacity" />
                            <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{r.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
