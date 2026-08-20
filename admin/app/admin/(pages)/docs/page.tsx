import { PageHeader } from "@/app/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

function Term({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-medium text-foreground">{name}</p>
      <p>{children}</p>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <PageHeader
          title="Documentation"
          description="A simple guide to using your admin panel. No technical knowledge needed."
        />

        <Section title="Dashboard">
          <p>
            This is your overview page. It shows how the store is doing at a
            glance.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium text-foreground">Total revenue</span>{" "}
              — money made from completed orders
            </li>
            <li>
              <span className="font-medium text-foreground">Total products</span>{" "}
              — how many products are in the store
            </li>
            <li>
              <span className="font-medium text-foreground">Total orders</span> —
              how many orders customers have placed
            </li>
            <li>
              <span className="font-medium text-foreground">Total users</span> —
              how many customer accounts exist
            </li>
          </ul>
          <p>
            The chart shows orders over time (for example last 7 days, 30 days,
            or 3 months). Below that you’ll see recent customers and recent
            reviews.
          </p>
        </Section>

        <Section title="Products">
          <p>
            Use this page to add, edit, or delete products that appear on the
            website.
          </p>
          <Term name="Name">The product name customers see.</Term>
          <Term name="Slug">
            The link text for the product page (usually created from the name).
          </Term>
          <Term name="Collection">
            The group this product belongs to (for example Luxury Wigs or Beauty
            Essentials).
          </Term>
          <Term name="Description">
            Short details about the product for the product page.
          </Term>
          <Term name="Price">
            Selling price in Naira (this is what is stored in the system).
          </Term>
          <Term name="Media">
            Photos or videos of the product. Add clear images so customers can
            see what they are buying.
          </Term>
          <Term name="Sizes">
            Optional. Use for wigs, clothing, etc. (for example 12&quot;, 14&quot;,
            S, M, L). Leave empty if the product has no sizes.
          </Term>
          <Term name="Track inventory">
            Turn this on if you want the website to count how many you have left.
            Turn it off if you always have stock or don’t want the site to track
            numbers.
          </Term>
          <Term name="Stock">
            How many of this product you currently have. When it reaches 0 (and
            tracking is on), customers can’t buy it.
          </Term>
          <Term name="Low stock threshold">
            A warning level. Example: if you set 5, the product is marked “low
            stock” when 5 or fewer are left.
          </Term>
          <Term name="Featured">
            Shows the product in special / highlighted areas on the website.
          </Term>
          <Term name="Active">
            When on, the product is visible in the store. When off, it is hidden
            from customers but still saved in admin.
          </Term>
        </Section>

        <Section title="Collections">
          <p>
            Collections are groups of products (for example “Luxury Wigs” or
            “Athleisure”).
          </p>
          <p>
            You can create, edit, or delete a collection. Give it a name,
            description, and image. Mark it as featured if you want it shown
            more prominently on the site.
          </p>
          <p>
            Products must belong to a collection, so create collections before
            (or while) adding products.
          </p>
        </Section>

        <Section title="Hero Banner">
          <p>
            This is the big image or video at the top of the homepage, with a
            title, short text, and a button (for example “Shop Now”).
          </p>
          <p>
            Update it whenever you want a new look or promotion on the homepage.
          </p>
        </Section>

        <Section title="Orders">
          <p>
            Here you see every order customers place. Open an order to see items,
            address, payment, and total.
          </p>
          <p>You can update the order status as you process it:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium text-foreground">Processing</span> —
              new order, still being prepared
            </li>
            <li>
              <span className="font-medium text-foreground">Confirmed</span> —
              you’ve accepted the order
            </li>
            <li>
              <span className="font-medium text-foreground">Shipped</span> — order
              has left the store / is on the way
            </li>
            <li>
              <span className="font-medium text-foreground">
                Ready for pickup
              </span>{" "}
              — for store pickup orders that are ready
            </li>
            <li>
              <span className="font-medium text-foreground">Delivered</span> —
              customer has received a door delivery
            </li>
            <li>
              <span className="font-medium text-foreground">Cancelled</span> —
              order was cancelled
            </li>
          </ul>
          <p>
            Pickup is free for the customer. Door delivery has a shipping fee.
            You can also add a tracking number when you have one.
          </p>
        </Section>

        <Section title="Users">
          <p>
            This page lists customer accounts. You can open a user to see their
            contact details, saved addresses, and orders.
          </p>
        </Section>

        <Section title="Discounts">
          <p>
            Create sales on selected products. Discounts show on the product card
            and product page (for example “20% off”).
          </p>
          <Term name="Percentage vs fixed">
            Percentage = off by % (e.g. 20%). Fixed = off by a set amount in
            Naira (e.g. ₦5,000).
          </Term>
          <Term name="Products">
            Choose which products the discount applies to.
          </Term>
          <Term name="Start / end dates">
            When the discount becomes active and when it stops.
          </Term>
          <Term name="Active">
            Turn off to pause a discount without deleting it.
          </Term>
        </Section>

        <Section title="Reviews">
          <p>
            Customer product reviews appear here. You can approve reviews so they
            show on the website, or hide/delete ones that shouldn’t be public.
          </p>
        </Section>

        <Section title="Subscribers">
          <p>
            People who signed up for email updates (newsletter / offers).
          </p>
          <p>
            You can see their email, turn a subscriber off (deactivate), or
            remove them. Only active subscribers should receive marketing
            emails.
          </p>
        </Section>

        <Section title="Account">
          <p>
            Update your admin name, email, and phone. This is your login
            profile for the admin panel.
          </p>
        </Section>

        <Section title="Preferences">
          <p>
            Choose light or dark mode for the admin panel display. This only
            changes how the admin looks for you — not the customer website.
          </p>
        </Section>

        <Section title="AI Assistant (Chat settings)">
          <p>
            The website has a chat assistant that helps customers. This page
            controls the business information that chat uses.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Brand name and about text</li>
            <li>Owner name and how long you’ve been in business</li>
            <li>Email, phone, WhatsApp, store address</li>
            <li>How to order and FAQs</li>
            <li>
              Extra notes for the assistant (temporary promos, special
              instructions)
            </li>
          </ul>
          <p>
            Keep this updated so the chat answers customers with the correct
            business details.
          </p>
        </Section>

        <Section title="Quick tips">
          <ul className="list-disc space-y-2 pl-5">
            <li>Always set price in Naira.</li>
            <li>
              Turn a product off (inactive) instead of deleting it if you might
              sell it again.
            </li>
            <li>
              Update order status as you process orders so customers (and you)
              can follow progress.
            </li>
            <li>
              Create collections first, then add products into those
              collections.
            </li>
            <li>
              Check Reviews regularly so only suitable reviews appear on the
              site.
            </li>
          </ul>
        </Section>
      </div>
    </main>
  );
}