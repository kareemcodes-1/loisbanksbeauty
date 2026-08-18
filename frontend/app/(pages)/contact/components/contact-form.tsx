"use client";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Message sent!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      value: "lbanksluxuryhairs@gmail.com",
      href: "mailto:lbanksluxuryhairs@gmail.com",
    },
    {
      icon: Phone,
      value: "08105001284",
      href: "tel:+2348105001284",
    },
    {
      icon: MapPin,
      value: "33a Sedona mall, Adebayo Doherty strt, Lekki phase 1",
    },
  ];

  return (
    <main className="w-full px-[1.5rem] sm:px-8 lg:px-[3rem] pb-[4rem] pt-[9rem]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-24">
        {/* LEFT */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <span className="subtitle">Contact Us</span>

          <h2 className="heading-1 max-w-[min(37.5rem,100%)] text-black">
            Let&apos;s Talk Beauty
          </h2>

          <div className="flex flex-col gap-4 pt-2 sm:gap-5 sm:pt-4">
            {contactItems.map((item, i) => {
              const Icon = item.icon;

              return (
                <div key={i} className="flex items-start gap-3 sm:items-center sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FD3F92]/10 sm:h-12 sm:w-12">
                    <Icon size={16} className="text-[#FD3F92] sm:size-[18px]" />
                  </div>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="break-words text-[0.95rem] text-black/90 transition-opacity hover:opacity-60 sm:text-[1.1rem]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="break-words text-[0.95rem] text-black/90 sm:text-[1.1rem]">
                      {item.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:gap-6 sm:rounded-[2rem] sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="h-11 rounded-full sm:h-12"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="h-11 rounded-full sm:h-12"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
              Subject
            </label>
            <Input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="h-11 rounded-full sm:h-12"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
              Message
            </label>
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="min-h-[7rem] w-full resize-none rounded-2xl sm:rounded-[2rem]"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {loading ? <Spinner className="size-6" /> : "Send Message"}
          </button>
        </div>
      </div>
    </main>
  );
}