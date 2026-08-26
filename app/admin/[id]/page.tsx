import { notFound } from "next/navigation";
import { adminClient } from "@/utils/supabase/admin";
import type { Item } from "@/lib/types";
import ItemForm from "@/components/ItemForm";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = adminClient();
  const { data } = await sb.from("items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <ItemForm item={data as Item} />;
}
