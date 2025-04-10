import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'

// Define type for full blog post data
interface Post {
  _id: string;
  title?: string;
  slug?: { current?: string };
  mainImage?: any;
  publishedAt?: string;
  body?: any[]; // Portable Text content
  author?: {
    name?: string;
    image?: any;
    bio?: any[]; // Portable Text content
  };
}

// GROQ query to fetch a single post by its slug
const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body,
    author->{
      name,
      image,
      bio
    }
  }
`

// Function to fetch a single post
async function getPost(slug: string): Promise<Post | null> {
  return await client.fetch(postQuery, { slug }) || null;
}

// Function to generate static paths if using SSG (optional)
// export async function generateStaticParams() {
//   const slugs = await client.fetch(groq`*[_type == "post" && defined(slug.current)][].slug.current`);
//   return slugs.map((slug: string) => ({ slug }));
// }

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // Show 404 if post not found
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 section-padding">
        <article className="max-w-3xl mx-auto">
          <h1 className="heading-1 mb-4">{post.title || 'Untitled Post'}</h1>

          {/* Author Info */}
          {post.author && (
            <div className="flex items-center space-x-3 mb-6 text-gray-600 dark:text-gray-400">
              {post.author.image && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name || 'Author image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span>By {post.author.name || 'Unknown Author'}</span>
              {post.publishedAt && (
                <span className="text-sm">
                  on {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              )}
            </div>
          )}

          {/* Main Image */}
          {post.mainImage && (
            <div className="relative h-64 md:h-96 w-full mb-8 overflow-hidden rounded-lg">
              <Image
                src={urlFor(post.mainImage).width(800).height(600).url()}
                alt={post.title || 'Blog post image'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Post Body */}
          <div className="prose dark:prose-invert max-w-none">
            {post.body ? (
              <PortableText value={post.body} />
            ) : (
              <p>Post content coming soon...</p>
            )}
          </div>

          {/* Optional Author Bio Section */}
          {post.author?.bio && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">About the Author</h3>
              <div className="prose dark:prose-invert max-w-none">
                <PortableText value={post.author.bio} />
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  )
}

// Optional: Revalidate individual post pages periodically or use ISR/on-demand
// export const revalidate = 3600; // Revalidate every hour 