import React from "react";

const RefundPolicyPage = () => {
  return (
    <main className="w-full pt-[9rem] pb-[6rem]">
      <section className="px-[1.5rem] sm:px-[2rem] lg:px-[3rem] mb-10 sm:mb-[4rem]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="subtitle">Customer Care</span>

          <h1 className="heading-1 mt-4">
            Refund & Exchange Policy
          </h1>

          <p className="mt-5 text-black/60 max-w-2xl mx-auto leading-relaxed">
            Please read our refund and exchange policy carefully before
            completing your purchase.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="px-5 sm:px-[1.5rem] lg:px-[3rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-8 sm:gap-10">

            {/* No Refunds */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                No Refunds or Returns
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                All purchases are considered final. We do not accept returns
                or offer refunds simply because you have changed your mind,
                selected the wrong item, or no longer want the product after
                purchase.
              </p>

              <p className="text-black/65 leading-7 sm:leading-8 mt-4">
                Due to the nature of our hair and beauty products, returned
                products cannot be resold once they have been delivered to a
                customer.
              </p>
            </div>

            {/* Exchanges */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                Exchanges
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                We accept exchanges on eligible products provided the item is
                returned in its original condition.
              </p>

              <ul className="mt-5 space-y-3 text-black/65 leading-7 list-disc pl-5">
                <li>The product must be unused and unworn.</li>
                <li>
                  The hair must not have been cut, coloured, washed, altered,
                  or chemically treated.
                </li>
                <li>The lace must remain intact and unaltered.</li>
                <li>
                  The product must be returned in its original condition and
                  packaging.
                </li>
                <li>
                  You must contact us before sending the product back.
                </li>
              </ul>
            </div>

            {/* Refund Exceptions */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                When Can a Refund Be Considered?
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                Refunds are not generally available. However, in rare
                circumstances, a refund may be considered when an issue is
                caused by Lois Banks Beauty or the manufacturer.
              </p>

              <ul className="mt-5 space-y-3 text-black/65 leading-7 list-disc pl-5">
                <li>A confirmed manufacturing defect.</li>
                <li>
                  The wrong product was sent due to an error on our part.
                </li>
                <li>
                  A significant product issue that was present before
                  delivery.
                </li>
              </ul>

              <p className="text-black/65 leading-7 sm:leading-8 mt-5">
                Each case will be reviewed individually before a decision is
                made. If the issue is determined to have been caused by the
                customer, a refund will not be issued.
              </p>
            </div>

            {/* Reporting an Issue */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                Reporting an Issue
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                If you believe you have received an incorrect, damaged, or
                defective product, please contact us as soon as possible after
                delivery.
              </p>

              <ul className="mt-5 space-y-3 text-black/65 leading-7 list-disc pl-5">
                <li>Your order number.</li>
                <li>A clear description of the issue.</li>
                <li>Clear photos or videos showing the product.</li>
                <li>Any additional information requested by our team.</li>
              </ul>
            </div>

            {/* Logistics */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                Delivery & Logistics Costs
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                Where an exchange is approved, logistics costs involved in
                returning or resending the product may apply. Responsibility
                for these costs will depend on the reason for the exchange and
                whether the issue was caused by the customer, Lois Banks
                Beauty, or the manufacturer.
              </p>
            </div>

            {/* Important Notice */}
            <div>
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                Important Notice
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                Please inspect your order carefully when it arrives. If you
                have any concerns about your product, do not alter, wash, cut,
                colour, install, or otherwise use the product before contacting
                us, as this may affect your eligibility for an exchange or
                refund review.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-black/10 pt-8">
              <h2 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.7rem] font-medium mb-3 sm:mb-4">
                Need Help?
              </h2>

              <p className="text-black/65 leading-7 sm:leading-8">
                If you have questions about an exchange or believe there is
                an issue with your order, please contact our customer care
                team before sending any product back. We are always happy to
                assist and help resolve eligible issues.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicyPage;

