import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  label: string;
  icon: SvgIconComponent | string;
  active?: boolean;
  badge?: string;
  children?: string[];
};

export type BatchRow = {
  id: string;
  upc?: string;
  batch: string;
  price?: string;
  weight?: string;
  offlinePrice?: string;
  quantity: string;
  channel: string;
  actionLabel?: string;
  approvalPending?: boolean;
  npc?: boolean;
  status?: "Rejected" | "Approval pending" | "Approved";
  statusNote?: string;
};

export type InventoryProduct = {
  id: string;
  approvalId?: string;
  sourceProductId?: string;
  name: string;
  subtitle?: string;
  category?: string;
  hsn: string;
  gst: string;
  label: "Packaged Item" | "Loose Item";
  labelTone: "orange" | "blue";
  totalQuantity: string;
  rows: BatchRow[];
  barcodeAction?: boolean;
};

export type InventoryTab =
  | "All items"
  | "Items added by you"
  | "Items sent for approval";

export type ProductDraft = {
  name: string;
  subtitle: string;
  category: string;
  hsn: string;
  gst: string;
  label: InventoryProduct["label"];
  price: string;
  weight: string;
  quantity: string;
  channel: string;
};

export type ApprovalRecord = {
  id: string;
  productId: string;
  rowId: string;
  status: NonNullable<BatchRow["status"]>;
  statusNote?: string;
};
