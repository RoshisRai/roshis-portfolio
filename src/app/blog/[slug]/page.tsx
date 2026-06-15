interface PageProps {
  params: Promise<{ slug: string }>
}


export default async function BlogPostPage ( 
    { params }: PageProps 
) {
    const { slug } = await params
    return (
        <div className="mt-16">
            <h1 className="text-4xl font-bold">{slug}</h1>
            <p className="mt-4 text-muted-foreground">
                Blog post content coming soon.
            </p>
        </div>
    )
}