import Link from 'next/link'
import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Header from '@/components/Header' // Adjust path if needed

// Define type for blog post preview data
interface PostPreview {
  _id: string;
  title?: string;
  slug?: { current?: string };
  mainImage?: any;
  publishedAt?: string;
  excerpt?: string;
  author?: {
    name?: string;
  };
}

// GROQ query to fetch published posts, ordered by date
const postsQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt < now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    author->{
      name
    }
  }
`

async function getPosts(): Promise<PostPreview[]> {
  return await client.fetch(postsQuery) || [];
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 section-padding">
        <h1 className="heading-1 text-center mb-12">Blog</h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug?.current}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 w-full">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(400).height(300).url()}
                      alt={post.title || 'Blog post image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-2 group-hover:underline">{post.title || 'Untitled Post'}</h2>
                  {post.publishedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                      {post.author?.name && ` by ${post.author.name}`}
                    </p>
                  )}
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No blog posts published yet.</p>
        )}
      </main>
    </>
  )
}

// Optional: Revalidate the index page periodically
// export const revalidate = 60; // Revalidate every 60 seconds 