function LandingFooter() {
    return (
        <section className="border-y border-black/10 bg-black/2">
            <div className="mx-auto grid max-w-7xl divide-y divide-black/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
                <div className="px-0 py-8 sm:px-8">
                    <p className="text-sm font-semibold">01</p>
                    <h3 className="mt-2 text-lg font-semibold">
                        AI Lead Generation
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                        Identify and qualify potential leads with AI-driven
                        workflows.
                    </p>
                </div>

                <div className="px-0 py-8 sm:px-8">
                    <p className="text-sm font-semibold">02</p>
                    <h3 className="mt-2 text-lg font-semibold">Intelligent Tasks</h3>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                        Keep work organized with structured tasks and automated
                        assistance.
                    </p>
                </div>

                <div className="px-0 py-8 sm:px-8">
                    <p className="text-sm font-semibold">03</p>
                    <h3 className="mt-2 text-lg font-semibold">
                        One Unified Workspace
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                        Bring your AI workflows, leads, and operations together in
                        one place.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default LandingFooter;
