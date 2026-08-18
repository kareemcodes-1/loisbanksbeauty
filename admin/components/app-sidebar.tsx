"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  PackageIcon,
  LayersIcon,
  ImageIcon,
  ShoppingCartIcon,
  UsersIcon,
  StarIcon,
  Percent,
  MailIcon,
} from "lucide-react";

const navMain = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: <PackageIcon />,
  },
  {
    title: "Collections",
    url: "/admin/collections",
    icon: <LayersIcon />,
  },
  {
    title: "Hero Banner",
    url: "/admin/hero-banner",
    icon: <ImageIcon />,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <UsersIcon />,
  },
  {
    title: "Discounts",
    url: "/admin/discounts",
    icon: <Percent />,
  },
  {
    title: "Reviews",
    url: "/admin/reviews",
    icon: <StarIcon />,
  },

  {
  title: "Subscribers",
  url: "/admin/subscribers",
  icon: <MailIcon />,
},
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || "Admin",
    email: session?.user?.email || "admin@loisbanksbeauty.com",
    avatar: "/favicon.jpeg", // or session?.user?.image if you store one later
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin/dashboard">
                <img
                  src="/favicon.jpeg"
                  alt="LoisBanks Beauty"
                  className="size-6 rounded-full object-cover"
                />
                <span className="text-base font-semibold">
                  LoisBanks Beauty
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}