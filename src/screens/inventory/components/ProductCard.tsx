import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { memo, useMemo, useState } from "react";
import type {
  ApprovalRecord,
  BatchRow,
  InventoryProduct,
  InventoryTab,
} from "../types";

const tableColumns = [
  "UPC Number",
  "Batch",
  "Price",
  "Weight",
  "Offline Selling Price",
  "Quantity",
  "Sales channel",
  "",
] as const;

const approvalColumns = [
  "UPC Number",
  "Batch",
  "Price",
  "Weight",
  "Offline Selling Price",
  "Quantity",
  "Sales channel",
  "Status",
  "",
] as const;

const looseColumns = [
  "UPC Number",
  "Batch",
  "Selling Price/Kg",
  "Quantity(Kg)",
  "Sales channel",
  "",
] as const;

const packagedColumnWidths = [150, 110, 120, 145, 160, 105, 145, 230];
const approvalColumnWidths = [140, 95, 115, 125, 150, 100, 130, 210, 150];
const looseColumnWidths = [210, 150, 190, 155, 175, 280];

type ProductCardProps = {
  product: InventoryProduct;
  mode: InventoryTab;
  onDeleteRow: (productId: string, rowId: string) => void;
  onEditRow: (productId: string, row: BatchRow) => void;
  onGenerateBarcode: (productId: string) => void;
  onStatusChange: (
    approvalId: string,
    status: ApprovalRecord["status"],
  ) => void;
};

function ProductBadge({ product }: { product: InventoryProduct }) {
  const tone =
    product.labelTone === "orange"
      ? "border-[#ff9f43] bg-[#fff7ed] text-[#f97316]"
      : "border-[#7c7cff] bg-[#f4f3ff] text-[#5b5ff2]";

  return (
    <span
      className={`flex h-7 items-center gap-1.5 rounded-md border px-3 text-[10px] font-bold ${tone}`}
    >
      <LockOutlinedIcon className="!h-3.5 !w-3.5" />
      {product.label}
    </span>
  );
}

function RowStatus({
  approvalId,
  onStatusChange,
  row,
}: {
  approvalId?: string;
  onStatusChange?: (
    approvalId: string,
    status: ApprovalRecord["status"],
  ) => void;
  row: BatchRow;
}) {
  if (row.status) {
    const statusColor = {
      Rejected: "text-[#d90945]",
      "Approval pending": "text-[#ffbf00]",
      Approved: "text-[#0f9f5b]",
    }[row.status];

    return (
      <span
        className={`inline-flex flex-col items-end gap-0.5 text-[10px] font-semibold ${statusColor}`}
      >
        <span className="inline-flex items-center gap-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${row.status === "Rejected" ? "bg-[#d90945]" : row.status === "Approved" ? "bg-[#0f9f5b]" : "bg-[#ffbf00]"}`}
          />
          {row.status}
        </span>
        <span className="flex flex-col items-center gap-2">
          <button
            onClick={() => window.alert(row.statusNote ?? `${row.status} item`)}
            className="font-bold text-[#1555ff]"
          >
            View details <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
          </button>
          {approvalId && row.status === "Approval pending" ? (
            <>
              <button
                onClick={() => onStatusChange?.(approvalId, "Approved")}
                className="rounded bg-[#e8f8ef] px-1.5 py-0.5 font-bold text-[#0f9f5b]"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange?.(approvalId, "Rejected")}
                className="rounded bg-[#fff0f2] px-1.5 py-0.5 font-bold text-[#d90945]"
              >
                Reject
              </button>
            </>
          ) : null}
        </span>
      </span>
    );
  }

  if (row.npc) {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-md border border-[#ffb27a] bg-[#fff8f0] px-2 text-[10px] font-bold text-[#f97316]">
        <ErrorOutlineIcon className="!h-3.5 !w-3.5" />
        NPC
      </span>
    );
  }

  if (!row.actionLabel) return null;

  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <span className="rounded bg-[#dff8ec] px-2 py-0.5 text-[10px] font-bold text-[#0f9f5b]">
        {row.actionLabel}
      </span>
      {row.approvalPending ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#ffbf00]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffbf00]" />
          Approval pending
        </span>
      ) : null}
    </span>
  );
}

function RowActions({
  onDelete,
  onEdit,
}: {
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onEdit}
        className="flex h-7 items-center gap-1 rounded-md border border-[#dfe5ed] bg-white px-2 text-[10px] font-bold text-[#526274]"
      >
        Edit
        <EditOutlinedIcon className="!h-3.5 !w-3.5" />
      </button>
      <button
        onClick={onDelete}
        className="grid h-7 w-7 place-items-center rounded-md bg-[#d90945] text-white"
      >
        <DeleteIcon className="!h-3.5 !w-3.5" />
      </button>
    </div>
  );
}

function ProductRow({
  approvalId,
  productId,
  isLoose,
  isApproval,
  onDelete,
  onEdit,
  onStatusChange,
  isSelected,
  onToggle,
  row,
}: {
  approvalId?: string;
  productId: string;
  isLoose: boolean;
  isApproval: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (
    approvalId: string,
    status: ApprovalRecord["status"],
  ) => void;
  isSelected: boolean;
  onToggle: () => void;
  row: BatchRow;
}) {
  if (isLoose) {
    return (
      <tr className="h-12 border-b border-[#edf1f5] text-[11px] font-medium text-[#526274]">
        <td className="px-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="mr-4 h-4 w-4 rounded border-[#d7dee8]"
          />
          {row.upc}
        </td>
        <td className="px-3">
          <span>{row.batch}</span>
          {row.batch === "1" ? (
            <button
              onClick={() =>
                window.alert(`Showing compact batch view for ${productId}`)
              }
              className="mt-2 block text-[10px] font-bold text-[#1555ff]"
            >
              View less <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
            </button>
          ) : null}
        </td>
        <td className="px-3">{row.offlinePrice}</td>
        <td className="px-3">{row.quantity}</td>
        <td className="px-3">{row.channel}</td>
        <td className="px-3">
          <div className="flex items-center justify-end gap-3">
            <RowStatus
              approvalId={approvalId}
              onStatusChange={onStatusChange}
              row={row}
            />
            {row.channel ? (
              <RowActions onDelete={onDelete} onEdit={onEdit} />
            ) : null}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="h-12 border-b border-[#edf1f5] text-[11px] font-medium text-[#526274]">
      <td className="px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="mr-4 h-4 w-4 rounded border-[#d7dee8]"
        />
        {row.upc}
      </td>
      <td className="px-3">
        <span>{row.batch}</span>
        {row.batch === "1" ? (
          <button
            onClick={() =>
              window.alert(`Showing compact batch view for ${productId}`)
            }
            className="mt-2 block text-[10px] font-bold text-[#1555ff]"
          >
            View less <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
          </button>
        ) : null}
      </td>
      <td className="px-3">{row.price}</td>
      <td className="px-3">{row.weight}</td>
      <td className="px-3">{row.offlinePrice}</td>
      <td className="px-3">{row.quantity}</td>
      <td className="px-3">{row.channel}</td>
      {isApproval ? (
        <td className="px-3 text-right">
          <RowStatus
            approvalId={approvalId}
            onStatusChange={onStatusChange}
            row={row}
          />
        </td>
      ) : null}
      <td className="px-3">
        <div className="flex items-center justify-end gap-3">
          {!isApproval ? (
            <RowStatus
              approvalId={approvalId}
              onStatusChange={onStatusChange}
              row={row}
            />
          ) : null}
          {row.channel ? (
            <RowActions onDelete={onDelete} onEdit={onEdit} />
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export const ProductCard = memo(function ProductCard({
  mode,
  onDeleteRow,
  onEditRow,
  onGenerateBarcode,
  onStatusChange,
  product,
}: ProductCardProps) {
  const isLoose = product.label === "Loose Item";
  const isApproval = mode === "Items sent for approval";
  const columns = useMemo(() => {
    if (isApproval) return approvalColumns;
    return isLoose ? looseColumns : tableColumns;
  }, [isApproval, isLoose]);
  const columnWidths = useMemo(() => {
    if (isApproval) return approvalColumnWidths;
    return isLoose ? looseColumnWidths : packagedColumnWidths;
  }, [isApproval, isLoose]);
  const tableWidth = columnWidths.reduce((total, width) => total + width, 0);
  const rejectedRow = product.rows.find((row) => row.status === "Rejected");
  const actionProductId = product.sourceProductId ?? product.id;

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const isAllSelected =
    product.rows.length > 0 &&
    product.rows.every((row) => selectedRows.has(row.id));

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(product.rows.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleToggleRow = (rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[#dde5ef] bg-white shadow-[0_8px_22px_rgba(30,43,62,0.05)]">
      <header
        className={`flex flex-wrap lg:flex-nowrap min-h-[64px] items-center px-4 py-3 lg:py-0 gap-y-4 gap-x-4 ${
          isApproval ? "bg-[#f8fafc]" : "bg-[#edf5ff]"
        }`}
      >
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleToggleAll}
          className="mr-4 h-4 w-4 rounded border-[#d7dee8]"
        />
        <img
          alt={product.name}
          className="mr-3 h-10 w-10 rounded-lg object-cover border border-[#dbe2ea]"
          src="/table-header.jpg"
        />
        <div className="min-w-[140px] lg:min-w-[190px] flex-1 lg:flex-none leading-tight">
          <p className="text-[12px] font-semibold text-[#334155]">
            {product.name}
          </p>
          {product.subtitle ? (
            <p className="text-[10px] font-medium text-[#7d8a9d]">
              {product.subtitle}
            </p>
          ) : null}
        </div>
        {product.category ? (
          <span className="lg:ml-auto lg:mr-16 rounded-md border border-[#d9e1ea] bg-white px-3 py-1 text-[10px] font-bold text-[#657386] whitespace-nowrap">
            CATEGORY: {product.category}
          </span>
        ) : (
          <span className="lg:ml-auto" />
        )}
        <div className="lg:mr-12 text-center leading-tight">
          <p className="text-[10px] font-semibold uppercase text-[#657386]">
            HSN
          </p>
          <p className="text-[11px] font-medium text-[#334155]">
            {product.hsn}
          </p>
        </div>
        <div className="lg:mr-8 text-center leading-tight">
          <p className="text-[10px] font-semibold uppercase text-[#657386]">
            GST
          </p>
          <p className="text-[11px] font-medium text-[#334155]">
            {product.gst}
          </p>
        </div>
        <div className="ml-auto lg:ml-0">
          <ProductBadge product={product} />
        </div>
      </header>

      <div className="overflow-x-auto overscroll-x-contain">
        <table
          className="table-fixed"
          style={{ minWidth: `${tableWidth}px`, width: `${tableWidth}px` }}
        >
          <colgroup>
            {columnWidths.map((width, index) => (
              <col
                key={`${product.id}-${index}`}
                style={{ width: `${width}px` }}
              />
            ))}
          </colgroup>
          <thead>
            <tr
              className={`h-9 border-b border-[#e7ecf2] text-left text-[10px] font-semibold text-[#526274] ${
                isApproval ? "bg-[#f8fafc]" : "bg-white"
              }`}
            >
              {columns.map((column) => (
                <th
                  key={column}
                  className={`whitespace-normal px-3 align-middle ${column === "UPC Number" ? "px-4" : ""}`}
                >
                  {column}
                  {column === "Sales channel" || column === "Status" ? (
                    <ErrorOutlineIcon className="ml-1 inline !h-3.5 !w-3.5 text-[#d45d83]" />
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.rows.map((row) => (
              <ProductRow
                key={row.id}
                approvalId={product.approvalId}
                productId={actionProductId}
                isApproval={isApproval}
                isLoose={isLoose}
                onDelete={() =>
                  onDeleteRow(
                    actionProductId,
                    row.id.replace(/-approval-\d+$/, ""),
                  )
                }
                onEdit={() =>
                  onEditRow(actionProductId, {
                    ...row,
                    id: row.id.replace(/-approval-\d+$/, ""),
                    status: undefined,
                    statusNote: undefined,
                  })
                }
                isSelected={selectedRows.has(row.id)}
                onToggle={() => handleToggleRow(row.id)}
                onStatusChange={onStatusChange}
                row={row}
              />
            ))}
            <tr className="h-10 bg-[#fafbfc] text-[11px] font-bold text-[#172033]">
              <td colSpan={isLoose ? 3 : 5} />
              <td className="px-3">Total Quantity</td>
              <td className="px-3">{product.totalQuantity}</td>
              <td colSpan={isApproval ? 2 : isLoose ? 2 : 1} />
            </tr>
            {product.barcodeAction && !isApproval ? (
              <tr className="h-12 text-[11px] font-medium">
                <td className="px-4 text-[#1555ff]">
                  <button
                    onClick={() => onGenerateBarcode(actionProductId)}
                    className="inline-flex items-center gap-2 font-bold"
                  >
                    <AddIcon className="!h-4 !w-4" />
                    Generate Barcode
                  </button>
                </td>
                <td className="px-3">-</td>
                <td className="px-3">₹200</td>
                <td className="px-3">800</td>
                <td className="px-3">Offline</td>
                <td className="px-3">
                  <RowActions
                    onDelete={() => onDeleteRow(actionProductId, "barcode-row")}
                    onEdit={() => onEditRow(actionProductId, product.rows[0])}
                  />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {rejectedRow ? (
        <div className="border-t border-[#ffd7df] bg-[#fff0f2] px-5 py-2 text-[11px] font-bold text-[#d90945]">
          {rejectedRow.statusNote ?? "Rejected due to XYZ."}
        </div>
      ) : null}
    </article>
  );
});
