import Product from "@/models/Product";

export async function ensureProductOrder() {
  const missing = await Product.exists({ order: null });
  if (!missing) return;

  const all = await Product.find({}).sort({ createdAt: -1 }).select("_id").lean();

  await Product.bulkWrite(
    all.map((product, index) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { order: index } },
      },
    }))
  );
}