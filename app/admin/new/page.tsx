import ItemForm from "@/components/ItemForm";
import { loadAdminMeta } from "@/lib/loadAdminMeta";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  const meta = await loadAdminMeta();
  return <ItemForm meta={meta} />;
}
