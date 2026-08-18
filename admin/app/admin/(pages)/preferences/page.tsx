"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { PageHeader } from "@/app/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoid hydration mismatch
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Preferences"
          description="Customize how the admin panel looks and feels."
        />

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Theme</Label>

              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                <Label
                  htmlFor="light"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <SunIcon className="size-5" />
                  <span className="text-sm font-medium">Light</span>
                </Label>

                <Label
                  htmlFor="dark"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <MoonIcon className="size-5" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>

                <Label
                  htmlFor="system"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="sr-only"
                  />
                  <MonitorIcon className="size-5" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}