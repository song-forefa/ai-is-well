import ItemForm from "@/components/ItemForm";
import { loadCategories } from "@/lib/loadCategories";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  const categories = await loadCategories();
  return <ItemForm categories={categories} />;
}
