import { notFound } from "next/navigation";
import { adminClient } from "@/utils/supabase/admin";
import type { Item } from "@/lib/types";
import ItemForm from "@/components/ItemForm";
import { loadAdminMeta } from "@/lib/loadAdminMeta";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = adminClient();
  const [{ data }, meta] = await Promise.all([
    sb.from("items").select("*").eq("id", id).maybeSingle(),
    loadAdminMeta(),
  ]);
  if (!data) notFound();
  return <ItemForm item={data as Item} meta={meta} />;
}
