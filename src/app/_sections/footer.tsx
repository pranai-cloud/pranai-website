export function PranFooter() {
  return (
    <footer className="border-t border-black/[0.06] py-8">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 sm:px-6 md:px-12 lg:px-20 text-sm text-secondary sm:flex-row">
        <p>© {new Date().getFullYear()} Pran.ai — A Fluxenta Product</p>
        <div className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-primary">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-primary">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
