import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Manage your account details, saved shipping addresses, and preferences.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden px-[1.5rem] lg:px-[3rem] pb-24 pt-[9rem]">
      <div className="mx-auto mb-8 max-w-[60rem] text-center sm:mb-10 lg:mb-12">
        <div className=" flex flex-col gap-[1rem]">
          <span className="subtitle">Account Settings</span>
        <h1 className="heading-1">Your profile</h1>
        </div>
        <p className="mx-auto mt-3 max-w-[22rem] text-sm text-black/50 sm:max-w-[28rem]">
          Update your details and manage shipping addresses.
        </p>
      </div>
      {children}
    </div>
  );
}