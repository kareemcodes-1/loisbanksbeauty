"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";

import {
  getChatSettings,
  updateChatSettings,
  type ChatSettingsPayload,
} from "@/actions/admin/chat-settings.actions";

type FaqForm = { question: string; answer: string };

export default function AiAssistantPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["chat-settings"],
    queryFn: getChatSettings,
  });

  const [brandName, setBrandName] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [yearsActive, setYearsActive] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [storeLocation, setStoreLocation] = React.useState("");
  const [howToOrder, setHowToOrder] = React.useState("");
  const [adminInstructions, setAdminInstructions] = React.useState("");
  const [faqs, setFaqs] = React.useState<FaqForm[]>([]);

  React.useEffect(() => {
    if (!data) return;
    setBrandName(data.brandName ?? "");
    setAbout(data.about ?? "");
    setOwner(data.owner ?? "");
    setYearsActive(data.yearsActive ?? "");
    setEmail(data.email ?? "");
    setPhone(data.phone ?? "");
    setWhatsapp(data.whatsapp ?? "");
    setStoreLocation(data.storeLocation ?? "");
    setHowToOrder(data.howToOrder ?? "");
    setAdminInstructions(data.adminInstructions ?? "");
    setFaqs(
      (data.faqs ?? []).map((f) => ({
        question: f.question,
        answer: f.answer,
      }))
    );
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: ChatSettingsPayload) => updateChatSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-settings"] });
      toast.success("AI assistant settings saved");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      brandName,
      about,
      owner,
      yearsActive,
      email,
      phone,
      whatsapp,
      storeLocation,
      howToOrder,
      faqs,
      adminInstructions,
    });
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (
    index: number,
    field: keyof FaqForm,
    value: string
  ) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const isSaving = updateMutation.isPending;

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="AI Assistant"
          description="Business info and FAQs used by the store chatbot. Your developer system rules stay separate."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6">
            {/* Brand */}
            <Card>
              <CardHeader>
                <CardTitle>Brand</CardTitle>
                <CardDescription>
                  Basic business identity the chatbot can share.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand name</Label>
                  <Input
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="min-h-24"
                    disabled={isSaving}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Input
                      id="owner"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsActive">Years active</Label>
                    <Input
                      id="yearsActive"
                      value={yearsActive}
                      onChange={(e) => setYearsActive(e.target.value)}
                      placeholder="e.g. Since 2019"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeLocation">Store location</Label>
                  <Textarea
                    id="storeLocation"
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    className="min-h-20"
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Ordering & FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="howToOrder">How to order</Label>
                  <Textarea
                    id="howToOrder"
                    value={howToOrder}
                    onChange={(e) => setHowToOrder(e.target.value)}
                    className="min-h-24"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>FAQs</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFaq}
                      disabled={isSaving}
                    >
                      <PlusIcon className="size-4" />
                      Add FAQ
                    </Button>
                  </div>

                  {faqs.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No FAQs yet. Add questions the chatbot should answer.
                    </p>
                  )}

                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-xl border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          FAQ {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => removeFaq(index)}
                          disabled={isSaving}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) =>
                          updateFaq(index, "question", e.target.value)
                        }
                        disabled={isSaving}
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) =>
                          updateFaq(index, "answer", e.target.value)
                        }
                        className="min-h-20"
                        disabled={isSaving}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Extra AI notes */}
            <Card>
              <CardHeader>
                <CardTitle>Extra AI instructions</CardTitle>
                <CardDescription>
                  Optional notes only for the chatbot (promos, tone, temporary
                  info). Core sales rules stay in code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={adminInstructions}
                  onChange={(e) => setAdminInstructions(e.target.value)}
                  className="min-h-28"
                  placeholder="e.g. Currently promoting natural black wigs. Mention free pickup at Lekki store."
                  disabled={isSaving}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                {isSaving ? "Saving..." : "Save settings"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}