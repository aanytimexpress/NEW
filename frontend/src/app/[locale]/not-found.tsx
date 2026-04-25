import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  return (
    <div className="news-container py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold">404</h1>
      <p className="mt-2 text-muted-foreground">The requested newsroom page was not found.</p>
      <Link href="/" className="mt-4 inline-block text-primary">
        Go back home
      </Link>
    </div>
  );
}
