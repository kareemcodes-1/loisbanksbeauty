"use client";

import * as React from "react";

import { PageHeader } from "@/app/components/page-header";
import { CollectionsTable } from "@/app/components/collections/collections-table";
import { CollectionDialog } from "@/app/components/collections/collection-dialog";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import type { Collection } from "@/types";

export default function CollectionsPage() {
    const [dialogOpen, setDialogOpen] =
        React.useState(false);

    const [editingCollection, setEditingCollection] =
        React.useState<Collection | null>(null);

    const handleCreate = () => {
        setEditingCollection(null);
        setDialogOpen(true);
    };

    const handleEdit = (collection: Collection) => {
        setEditingCollection(collection);
        setDialogOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);

        if (!open) {
            setEditingCollection(null);
        }
    };

    return (
        <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-6">
                <PageHeader
                    title="Collections"
                    description="Manage your collections and organize your products."
                    action={
                        <Button
                            size="lg"
                            onClick={handleCreate}
                        >
                            <PlusIcon />
                            Create Collection
                        </Button>
                    }
                />

                <CollectionsTable onEdit={handleEdit} />

                <CollectionDialog
                    open={dialogOpen}
                    onOpenChange={handleOpenChange}
                    collection={editingCollection}
                />
            </div>
        </main>
    );
}