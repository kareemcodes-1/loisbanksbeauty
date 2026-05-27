export default function Stats() {
  const stats = [
    {
      number: "50",
      suffix: "+",
      desc: "Businesses worked with",
    },
    {
      number: "80",
      suffix: "+",
      desc: "Websites delivered",
    },
    {
      number: "$500K",
      suffix: "+",
      desc: "Revenue influenced",
    },
    {
      number: "80",
      suffix: "%",
      desc: "Increase in leads",
    },
  ];

  return (
    <section className="px-4 sm:px-8 py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`
                flex flex-col items-center text-center
                mb-8 md:mb-0
                ${i !== 0 ? "md:pl-[1rem]" : ""}
                pr-0 md:pr-[1rem]
              `}
            >
              {/* Large number */}
              <h2
                className="
                  !text-[2.2rem] sm:!text-[2.8rem] md:!text-[3.5rem]
                  mb-2 md:mb-3
                  leading-tight
                "
              >
                {stat.number}
                <span className="text-white">{stat.suffix}</span>
              </h2>

              {/* Description */}
              <p className="text-[0.95rem] md:text-[1rem] text-gray-400 max-w-[160px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}