import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 flex flex-col items-center justify-center gap-5 p-4">
      <div className="text-8xl">🍃</div>
      <h1 className="font-display text-4xl font-bold text-maroon-800 dark:text-gold-400">
        404 – Page Not Found
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-md">
        Oops! Looks like this page went back to Amma&apos;s kitchen. Let&apos;s
        get you back to the good stuff.
      </p>
      <Link href="/" className="btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}
