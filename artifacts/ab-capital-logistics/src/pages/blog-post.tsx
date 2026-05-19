import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "./blog-data";

interface BlogPostProps {
  params: { slug?: string };
}

// Parse inline markdown: **bold**, [text](url), and plain text
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Combined regex: matches [text](url) or **bold**
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      // Link: [text](url)
      const href = match[2];
      const isExternal = href.startsWith("http");
      nodes.push(
        isExternal ? (
          <a
            key={keyCounter++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 underline font-medium"
          >
            {match[1]}
          </a>
        ) : (
          <Link
            key={keyCounter++}
            href={href}
            className="text-accent hover:text-accent/80 underline font-medium"
          >
            {match[1]}
          </Link>
        )
      );
    } else if (match[3] !== undefined) {
      // Bold: **text**
      nodes.push(<strong key={keyCounter++} className="font-semibold text-gray-800">{match[3]}</strong>);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function renderContent(content: string): React.ReactNode[] {
  const blocks = content.split("\n\n").filter(Boolean);
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const block of blocks) {
    const trimmed = block.trim();

    // H2 heading
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b border-gray-100">
          {trimmed.replace(/^## /, "")}
        </h2>
      );
      continue;
    }

    // H3 heading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-primary mt-7 mb-3">
          {trimmed.replace(/^### /, "")}
        </h3>
      );
      continue;
    }

    // Table (lines starting with |)
    if (trimmed.startsWith("|")) {
      const rows = trimmed.split("\n").filter((r) => r.trim() !== "" && !r.match(/^\|[-| ]+\|$/));
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter((_, ci) => ci > 0 && ci < row.split("|").length - 1);
                return (
                  <tr key={ri} className={ri === 0 ? "bg-primary text-white" : ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    {cells.map((cell, ci) => (
                      ri === 0
                        ? <th key={ci} className="px-4 py-2 text-left font-semibold border border-gray-200">{cell.trim()}</th>
                        : <td key={ci} className="px-4 py-2 border border-gray-200 text-gray-600">{cell.trim()}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
      elements.push(
        <ul key={key++} className="list-disc pl-6 space-y-2 mb-5 text-gray-600">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item.replace(/^- /, ""))}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list (lines starting with "1." "2." etc.)
    if (/^\d+\.\s/.test(trimmed)) {
      const lines = trimmed.split("\n");
      const listItems: string[] = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        if (/^\d+\.\s/.test(line)) {
          const text = line.replace(/^\d+\.\s+/, "");
          let combined = text;
          // Collect continuation lines (bold sub-headers after the text)
          while (i + 1 < lines.length && !/^\d+\.\s/.test(lines[i + 1].trim()) && lines[i + 1].trim() !== "") {
            i++;
            combined += " " + lines[i].trim();
          }
          listItems.push(combined);
        }
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal pl-6 space-y-3 mb-5 text-gray-600">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Default: paragraph
    elements.push(
      <p key={key++} className="text-gray-600 leading-relaxed mb-5">
        {renderInline(trimmed)}
      </p>
    );
  }

  return elements;
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

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary pt-40 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${post.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-accent hover:text-accent/80 mb-6 font-medium" data-testid="link-back-blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-5 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <motion.article
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              data-testid="article-content"
            >
              {/* Excerpt lead */}
              <p className="text-lg text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium">
                {post.excerpt}
              </p>

              {/* Rendered content */}
              <div className="prose-content">
                {renderContent(post.content)}
              </div>

              {/* Navigation */}
              <div className="border-t border-gray-100 mt-12 pt-8 flex justify-between gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="flex-1" data-testid="link-prev-post">
                    <div className="group flex items-start gap-3 text-left p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-gray-400 mt-1 group-hover:text-accent transition-colors flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Previous</p>
                        <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">{prevPost.title}</p>
                      </div>
                    </div>
                  </Link>
                ) : <div />}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} className="flex-1 text-right" data-testid="link-next-post">
                    <div className="group flex items-end gap-3 justify-end p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Next</p>
                        <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">{nextPost.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-1 group-hover:text-accent transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                )}
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA */}
                <div className="bg-primary rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-3">Need Logistics Help?</h3>
                  <p className="text-gray-300 text-sm mb-5">Our experts are ready to assist with your freight requirements across Cameroon and Central Africa.</p>
                  <Link href="/quote" data-testid="link-sidebar-quote">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white text-sm">Get a Free Quote</Button>
                  </Link>
                  <Link href="/contact" className="block mt-3 text-center text-sm text-gray-400 hover:text-accent transition-colors">
                    Contact Us
                  </Link>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div>
                    <h3 className="font-bold text-primary mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} data-testid={`link-related-${r.slug}`}>
                          <div className="group cursor-pointer">
                            <img src={r.image} alt={r.title} className="w-full h-28 object-cover rounded-xl mb-3 group-hover:opacity-80 transition-opacity" />
                            <span className="text-xs text-accent font-semibold">{r.category}</span>
                            <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors mt-1 line-clamp-2">{r.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Posts */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-bold text-primary mb-3 text-sm">Browse All Posts</h3>
                  <Link href="/blog">
                    <Button variant="outline" className="w-full text-sm border-primary text-primary hover:bg-primary hover:text-white">
                      View All Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
