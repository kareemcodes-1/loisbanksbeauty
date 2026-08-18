"use client";

import * as React from "react";

import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/app/components/page-header";
import { HeroBannersTable } from "@/app/components/hero-banner/hero-banner-table";
import { HeroBannerDialog } from "@/app/components/hero-banner/hero-banner-dialog";

import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon } from "lucide-react";

import { getHeroBanner } from "@/actions/admin/hero-banner.actions";
import type { HeroBanner } from "@/types";

export default function HeroBannersPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingHeroBanner, setEditingHeroBanner] =
    React.useState<HeroBanner | null>(null);

  const { data: banner } = useQuery({
    queryKey: ["hero-banner"],
    queryFn: getHeroBanner,
  });

  const handleCreate = () => {
    setEditingHeroBanner(null);
    setDialogOpen(true);
  };

  const handleEdit = (heroBanner: HeroBanner) => {
    setEditingHeroBanner(heroBanner);
    setDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingHeroBanner(null);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Hero Banner"
          description="Manage your homepage hero banner content and appearance."
          action={
            banner ? (
              <Button
                size="lg"
                onClick={() => handleEdit(banner)}
              >
                <PencilIcon />
                Edit Hero Banner
              </Button>
            ) : (
              <Button size="lg" onClick={handleCreate}>
                <PlusIcon />
                Create Hero Banner
              </Button>
            )
          }
        />

        <HeroBannersTable
          onEdit={handleEdit}
          onCreate={handleCreate}
        />

        <HeroBannerDialog
          open={dialogOpen}
          onOpenChange={handleOpenChange}
          heroBanner={editingHeroBanner}
        />
      </div>
    </main>
  );
}