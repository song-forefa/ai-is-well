import { notFound } from "next/navigation";
import { adminClient } from "@/utils/supabase/admin";
import type { Item } from "@/lib/types";
import ItemForm from "@/components/ItemForm";
import { loadCategories } from "@/lib/loadCategories";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = adminClient();
  const [{ data }, categories] = await Promise.all([
    sb.from("items").select("*").eq("id", id).maybeSingle(),
    loadCategories(),
  ]);
  if (!data) notFound();
  return <ItemForm item={data as Item} categories={categories} />;
}
