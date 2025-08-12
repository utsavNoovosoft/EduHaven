function Footer() {
  return (
    <footer
      className="py-8 px-6"
      style={{ borderColor: "var(--txt-disabled)" }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div
            className="text-2xl font-bold mb-4 md:mb-0"
            style={{ color: "var(--btn)" }}
          >
            EduHaven
          </div>
          <div className="text-sm" style={{ color: "var(--txt-dim)" }}>
            Made with ❤️ for students worldwide
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
