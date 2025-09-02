import BuyersLayoutClient from "@/components/BuyerPanel/BuyersLayoutClient";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/model/Category";

export const revalidate = 0;

export default async function BuyersLayout({ children }) {
  const categories = await getCategories();
  return <BuyersLayoutClient categories={categories}>{children}</BuyersLayoutClient>;
}

async function getCategories() {
  try {
    await dbConnect();
    const categories = await Category.find({ published: true })
      .sort({ sortOrder: 1 })
      .select("name slug subCategories")
      .lean();
    return categories;
  } catch (error) {
    console.error("Failed to load categories", error);
    return [];
  }
}
