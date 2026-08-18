"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactData = {
  email: string;
  phone: string;
};

type Props = {
  data: ContactData;
  onChange: (field: keyof ContactData, value: string) => void;
};

export default function ContactSection({ data, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">Contact</h2>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.7rem] uppercase font-medium text-black/80 tracking-[0.05em]"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-11 rounded-xl border-black/10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-[0.7rem] uppercase font-medium text-black/80 tracking-[0.05em]"
          >
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="h-11 rounded-xl border-black/10"
            required
          />
        </div>
      </div>
    </section>
  );
}