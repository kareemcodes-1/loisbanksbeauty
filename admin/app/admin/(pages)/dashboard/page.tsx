import { getOrderChart } from "@/actions/admin/order-chart.actions";
import {
  getOrders,
  getTotalRevenue,
} from "@/actions/admin/order.actions";
import { getProducts } from "@/actions/admin/product.actions";
import { getReviews } from "@/actions/admin/review.actions";
import { getUsers } from "@/actions/admin/user.actions";

import { RecentReviews } from "@/app/components/dashboard/recent-reviews";
import { RecentUsers } from "@/app/components/dashboard/recent-users";
import { SectionCards } from "@/app/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

const DashboardPage = async () => {
  const [
    productsResult,
    ordersResult,
    usersResult,
    totalRevenue,
    orderChart,
    reviewsResult,
  ] = await Promise.all([
    // Total products
    getProducts({
      page: 1,
      limit: 1,
    }),

    // Total orders
    getOrders({ page: 1, limit: 1 }),

    // Total users + recent users
    getUsers({ page: 1, limit: 5 }),

    // Total revenue
    getTotalRevenue(),

    // Orders chart
    getOrderChart("3months"),

    // Recent reviews
    getReviews({ page: 1, limit: 2 }),
  ]);

  const totalProducts = productsResult.pagination.total;
  const totalOrders = ordersResult.pagination.total;
  const totalUsers = usersResult.pagination.total;

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
        {/* Dashboard Overview */}
        <SectionCards
          totalProducts={totalProducts}
          totalOrders={totalOrders}
          totalUsers={totalUsers}
          revenue={totalRevenue}
        />

        {/* Orders Chart */}
        <div className="">
          <ChartAreaInteractive initialData={orderChart} />
        </div>

        {/* Recent Users + Reviews */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecentUsers users={usersResult.users} />

          <RecentReviews reviews={reviewsResult.reviews} />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;