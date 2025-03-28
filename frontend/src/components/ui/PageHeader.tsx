interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      {description && <p className="text-lg text-gray-600">{description}</p>}
    </div>
  );
}
