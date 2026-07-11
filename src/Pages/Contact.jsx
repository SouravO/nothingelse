export default function ContactPage() {
  return (
    <section className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-content gap-16 md:grid-cols-2 md:gap-24">
        <Reveal direction="left">
          <div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-brand-black md:text-5xl">
              Good product.
              <br />
              Fair price.
              <br />
              Nothing else.
            </h1>
            <span className="brand-rule my-6" />
            <p className="max-w-sm font-body text-lg text-brand-black/70">
              Own the shelf through consistency, not clutter — reach out for
              stocking, retail partnerships, or general enquiries.
            </p>

            <div className="mt-12 space-y-1 font-body text-brand-black/70">
              <p className="font-semibold text-brand-black">Follow</p>
              <p>@nothing_else</p>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
