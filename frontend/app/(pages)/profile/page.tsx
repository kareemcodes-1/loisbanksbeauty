import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile.actions";
import ProfileForm from "./components/profile-form";
import AddressList from "./components/address-list";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="mx-auto grid max-w-[60rem] gap-10 lg:grid-cols-2 lg:gap-14">
      <ProfileForm user={profile} />
      <AddressList addresses={profile.addresses} />
    </div>
  );
}