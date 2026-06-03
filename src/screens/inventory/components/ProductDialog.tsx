import CloseIcon from "@mui/icons-material/Close";
import { memo, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { BatchRow, ProductDraft } from "../types";

const defaultDraft: ProductDraft = {
  name: "",
  subtitle: "",
  category: "Namkeen",
  hsn: "19023010",
  gst: "18%",
  label: "Packaged Item",
  price: "₹20,000",
  weight: "200g",
  quantity: "800",
  channel: "Offline",
};

type ProductDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draft: ProductDraft) => void;
};

type RowDialogProps = {
  isOpen: boolean;
  row: BatchRow | null;
  onClose: () => void;
  onSave: (row: BatchRow) => void;
};

function DialogShell({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
      <section className="w-full max-w-[520px] rounded-2xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <header className="flex h-14 items-center border-b border-[#e9edf3] px-5">
          <h2 className="text-sm font-bold text-[#172033]">{title}</h2>
          <button onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-[#f6f8fb]">
            <CloseIcon className="!h-4 !w-4" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Field({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-[#526274]">{label}</span>
      <input
        className="h-10 w-full rounded-lg border border-[#dbe2ea] px-3 text-sm font-medium outline-none focus:border-[#1555ff]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export const ProductDialog = memo(function ProductDialog({
  isOpen,
  onClose,
  onSave,
}: ProductDialogProps) {
  const [draft, setDraft] = useState<ProductDraft>(defaultDraft);

  useEffect(() => {
    if (isOpen) setDraft(defaultDraft);
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (key: keyof ProductDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <DialogShell onClose={onClose} title="Add new product">
      <form
        className="grid gap-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product name" onChange={(value) => update("name", value)} value={draft.name} />
          <Field label="Subtitle" onChange={(value) => update("subtitle", value)} value={draft.subtitle} />
          <Field label="Category" onChange={(value) => update("category", value)} value={draft.category} />
          <Field label="HSN" onChange={(value) => update("hsn", value)} value={draft.hsn} />
          <Field label="GST" onChange={(value) => update("gst", value)} value={draft.gst} />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold text-[#526274]">Type</span>
            <select
              className="h-10 w-full rounded-lg border border-[#dbe2ea] px-3 text-sm font-medium outline-none focus:border-[#1555ff]"
              onChange={(event) => update("label", event.target.value)}
              value={draft.label}
            >
              <option>Packaged Item</option>
              <option>Loose Item</option>
            </select>
          </label>
          <Field label="Price" onChange={(value) => update("price", value)} value={draft.price} />
          <Field label="Weight" onChange={(value) => update("weight", value)} value={draft.weight} />
          <Field label="Quantity" onChange={(value) => update("quantity", value)} value={draft.quantity} />
          <Field label="Sales channel" onChange={(value) => update("channel", value)} value={draft.channel} />
        </div>

        <footer className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#dbe2ea] px-4 text-sm font-bold">
            Cancel
          </button>
          <button
            disabled={!draft.name.trim()}
            className="h-10 rounded-lg bg-[#1555ff] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save product
          </button>
        </footer>
      </form>
    </DialogShell>
  );
});

export const RowDialog = memo(function RowDialog({
  isOpen,
  onClose,
  onSave,
  row,
}: RowDialogProps) {
  const [draft, setDraft] = useState<BatchRow | null>(row);

  useEffect(() => {
    setDraft(row);
  }, [row]);

  if (!isOpen || !draft) return null;

  const update = (key: keyof BatchRow, value: string) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  return (
    <DialogShell onClose={onClose} title="Edit item">
      <form
        className="grid gap-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="UPC Number" onChange={(value) => update("upc", value)} value={draft.upc ?? ""} />
          <Field label="Batch" onChange={(value) => update("batch", value)} value={draft.batch} />
          <Field label="Price" onChange={(value) => update("price", value)} value={draft.price ?? ""} />
          <Field label="Weight" onChange={(value) => update("weight", value)} value={draft.weight ?? ""} />
          <Field label="Offline selling price" onChange={(value) => update("offlinePrice", value)} value={draft.offlinePrice ?? ""} />
          <Field label="Quantity" onChange={(value) => update("quantity", value)} value={draft.quantity} />
          <Field label="Sales channel" onChange={(value) => update("channel", value)} value={draft.channel} />
        </div>
        <footer className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#dbe2ea] px-4 text-sm font-bold">
            Cancel
          </button>
          <button className="h-10 rounded-lg bg-[#1555ff] px-5 text-sm font-bold text-white">
            Save changes
          </button>
        </footer>
      </form>
    </DialogShell>
  );
});
