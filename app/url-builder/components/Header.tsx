export function Header() {
  return (
    <header className="relative pt-16 pb-12 text-center animate-fade-in-up container-centered">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-shimmer"
          style={{ animationDuration: "8s" }}
        >
          GitHub Readme Stats
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
          Craft beautiful, personalized stats cards for your GitHub profile with live preview
        </p>
      </div>
    </header>
  );
}