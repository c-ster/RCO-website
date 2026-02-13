import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-accent/20 bg-accent/5 text-xs font-medium text-accent tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            NAVAL RAPID CAPABILITIES OFFICE
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary">
            NAV-
            <span className="text-accent">FORGE</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            The Digital Foundry where urgency meets execution.
            Rapidly transition technology from innovation to the Fleet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="px-8 py-3 text-sm font-semibold text-background bg-accent hover:bg-accent-hover rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              Submit a Capability
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary border border-border hover:border-accent/30 rounded-lg transition-all"
            >
              Director Login
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submit */}
          <div className="group p-6 bg-surface rounded-xl border border-border-subtle hover:border-accent/20 transition-all">
            <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-accent/10 text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Submit</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Frictionless intake for vendors, startups, and academic partners. Guided wizard captures capability, TRL, SWaP-C, and deployment readiness.
            </p>
          </div>

          {/* Evaluate */}
          <div className="group p-6 bg-surface rounded-xl border border-border-subtle hover:border-info/20 transition-all">
            <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-info/10 text-info">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Evaluate</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI-powered Prioritization Agent scores submissions against CNO Fighting Instructions. Unified Capability Index with full chain-of-thought reasoning.
            </p>
          </div>

          {/* Deploy */}
          <div className="group p-6 bg-surface rounded-xl border border-border-subtle hover:border-success/20 transition-all">
            <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-success/10 text-success">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Deploy</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              DigitalFoundry matches high-scoring capabilities to host platforms and deployment windows. From submission to Fleet in weeks, not years.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-accent">72hr</p>
              <p className="mt-1 text-sm text-text-muted">Initial Response</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-info">AI</p>
              <p className="mt-1 text-sm text-text-muted">Powered Triage</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success">TRL 1-9</p>
              <p className="mt-1 text-sm text-text-muted">Full Spectrum</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning">IL5</p>
              <p className="mt-1 text-sm text-text-muted">Secure Enclave</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-text-muted">
            Naval Rapid Capabilities Office &middot; Department of the Navy &middot; Foundry-to-Fleet Pipeline
          </p>
        </div>
      </footer>
    </div>
  );
}
