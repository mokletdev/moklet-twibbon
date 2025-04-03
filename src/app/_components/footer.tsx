export const Footer = () => {
  return (
    <footer className="w-full px-4 md:px-8 bg-primary-500 text-white">
      <div className="border-neutral-600 max-w-7xl mx-auto mt-12 py-8 text-center">
        <p>
          © {new Date().getFullYear()} Moklet Developers. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
