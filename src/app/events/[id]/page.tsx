'use client';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="p-8">
        <h1 className="text-white text-2xl">Event Detail: {params.id}</h1>
      </div>
    </main>
  );
}
