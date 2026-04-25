interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 border-b pb-4">
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>
      {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
    </header>
  );
}
