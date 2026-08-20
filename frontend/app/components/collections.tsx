import Image from "next/image";
import Link from "next/link";

import { getCollections } from "@/actions/collection.actions";
import { SplitLines } from "@/components/animations/SplitLines";
import FadeContent from "@/components/animations/fade-content";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <section className="section-spacing w-full">
      <div className="flex flex-col">
        <div className="mb-8 flex flex-col items-center gap-3 text-center md:mb-12 md:gap-4">
          <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">Luxury Collections</span>
          </FadeContent>

          <SplitLines
                    tag="h2"
                    text="Shop Collections"
                    className="heading-1 max-w-[min(40rem,100%)]"
                    duration={1}
                    stagger={0.025}
                    yPercent={100}
                    rootMargin="-100px"
                    ease="power4.out"
                  />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {collections.map((item) => (
            <FadeContent key={item._id} blur={true} duration={1000} initialOpacity={0}>
            <div
              className="relative h-[18rem] w-full overflow-hidden rounded-lg sm:h-[22rem] md:h-[25rem]"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:h-[45%]" />

              <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 md:p-6">
                <div className="flex flex-col items-start gap-3 sm:gap-4">
                  <h3 className="heading-3 max-w-full text-white">
                    {item.name}
                  </h3>

                  <Link href="/shop" className="btn-primary self-start">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;