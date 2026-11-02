// app/checkout/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import CheckoutForm from "./components/checkout-form";

export default async function CheckoutPage() {
  // Session may be null: checkout is open to guests
  const session = await getServerSession(authOptions);

  // Empty user = guest. Logged-in users get their details prefilled.
  let user = {
    email: "",
    phone: "",
    name: "",
    addresses: [] as {
      _id: string;
      firstName: string;
      lastName: string;
      address: string;
      apartment: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    }[],
  };

  let isGuest = true;

  if (session?.user?.email) {
    await connectDB();

    const userDoc = await User.findOne({ email: session.user.email })
      .select("name email phone addresses")
      .lean();

    // If the account no longer exists, treat them as a guest instead of redirecting
    if (userDoc) {
      isGuest = false;
      user = {
        email: userDoc.email,
        phone: userDoc.phone || "",
        name: userDoc.name || "",
        addresses: (userDoc.addresses || []).map((addr: any) => ({
          _id: addr._id.toString(),
          firstName: addr.firstName,
          lastName: addr.lastName,
          address: addr.address,
          apartment: addr.apartment || "",
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
          isDefault: addr.isDefault || false,
        })),
      };
    }
  }

  return (
    <section className="min-h-screen px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-[3rem] lg:pb-24 lg:pt-[9rem]">
      <div className="mx-auto mb-8 max-w-[60rem] text-center sm:mb-10 lg:mb-12">
        <span className="subtitle">Checkout</span>
        <h1 className="heading-1 mt-3">Complete your order</h1>
        <p className="mx-auto mt-3 max-w-[22rem] text-sm text-black/50 sm:max-w-[28rem]">
          Review your details and place your order securely.
        </p>
      </div>

      <div className="mx-auto max-w-[72rem]">
        {isGuest && (
          <p className="mb-6 rounded-lg border border-dashed border-[#FD3F92]/40 px-4 py-3 text-center text-xs text-black/70 sm:text-sm">
            Already have an account?{" "}
            <Link
              href="/login?callbackUrl=/checkout"
              className="text-black underline transition-colors hover:text-[#FD3F92]"
            >
              Log in
            </Link>{" "}
            for faster checkout.
          </p>
        )}

        <CheckoutForm user={user} />
      </div>
    </section>
  );
}