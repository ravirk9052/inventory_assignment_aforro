import MenuIcon from "@mui/icons-material/Menu";
import { memo, useCallback, useMemo, useState } from "react";
import { products as initialProducts } from "./inventoryData";
import { InventoryToolbar } from "./components/InventoryToolbar";
import { ProductDialog, RowDialog } from "./components/ProductDialog";
import { ProductCard } from "./components/ProductCard";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import type {
  ApprovalRecord,
  BatchRow,
  InventoryProduct,
  InventoryTab,
  ProductDraft,
} from "./types";

type EditingRow = {
  productId: string;
  row: BatchRow;
} | null;

const screenMeta: Record<InventoryTab, { title: string; wireframe: string }> = {
  "All items": { title: "Final inventory", wireframe: "Wireframe - 85" },
  "Items added by you": {
    title: "Item added by you",
    wireframe: "Wireframe - 98",
  },
  "Items sent for approval": {
    title: "Item sent for approval",
    wireframe: "Wireframe - 76",
  },
};

function createInitialApprovals(
  products: InventoryProduct[],
): ApprovalRecord[] {
  const packagedProduct = products.find(
    (product) => product.label === "Packaged Item",
  );

  if (!packagedProduct) return [];

  return (["Rejected", "Approval pending", "Approved"] as const).flatMap(
    (status, index) => {
      const row =
        packagedProduct.rows.find((item) => item.channel) ??
        packagedProduct.rows[0];
      if (!row) return [];

      return {
        id: `approval-${packagedProduct.id}-${row.id}-${index}`,
        productId: packagedProduct.id,
        rowId: row.id,
        status,
        statusNote: index === 0 ? "Rejected due to XYZ." : undefined,
      };
    },
  );
}

function createApprovalProducts(
  products: InventoryProduct[],
  approvals: ApprovalRecord[],
) {
  return approvals.flatMap((approval) => {
    const product = products.find((item) => item.id === approval.productId);
    if (!product) return [];

    const row =
      product.rows.find((item) => item.id === approval.rowId) ??
      product.rows.find((item) => item.channel);
    if (!row) return [];

    return [
      {
        ...product,
        approvalId: approval.id,
        id: `${product.id}-${approval.id}`,
        sourceProductId: product.id,
        rows: [
          {
            ...row,
            id: row.id,
            status: approval.status,
            statusNote: approval.statusNote,
          },
          ...product.rows.filter((item) => !item.channel).slice(0, 3),
        ],
      },
    ];
  });
}

function makeProductFromDraft(draft: ProductDraft): InventoryProduct {
  const id = `product-${Date.now()}`;
  const isLoose = draft.label === "Loose Item";

  return {
    id,
    name: draft.name.trim(),
    subtitle: draft.subtitle.trim(),
    category: draft.category.trim(),
    hsn: draft.hsn.trim(),
    gst: draft.gst.trim(),
    label: draft.label,
    labelTone: isLoose ? "blue" : "orange",
    totalQuantity: isLoose ? `${draft.quantity}kg` : draft.quantity,
    barcodeAction: isLoose,
    rows: [
      {
        id: `${id}-row-1`,
        upc: "1234567890",
        batch: "-",
        price: draft.price,
        weight: draft.weight,
        offlinePrice: isLoose ? draft.price : "₹200",
        quantity: draft.quantity,
        channel: draft.channel,
        actionLabel: "Added by you",
        approvalPending: !isLoose,
      },
    ],
  };
}

function ProductList({
  mode,
  onDeleteRow,
  onEditRow,
  onGenerateBarcode,
  onStatusChange,
  products,
}: {
  mode: InventoryTab;
  onDeleteRow: (productId: string, rowId: string) => void;
  onEditRow: (productId: string, row: BatchRow) => void;
  onGenerateBarcode: (productId: string) => void;
  onStatusChange: (
    approvalId: string,
    status: ApprovalRecord["status"],
  ) => void;
  products: InventoryProduct[];
}) {
  if (products.length === 0) {
    return (
      <div className="grid h-60 place-items-center p-5">
        <div className="text-center">
          <p className="text-sm font-bold text-[#172033]">No products found</p>
          <p className="mt-1 text-[11px] font-medium text-[#738095]">
            Change the search/filter options or add a new product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5 pb-16">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          mode={mode}
          onDeleteRow={onDeleteRow}
          onEditRow={onEditRow}
          onGenerateBarcode={onGenerateBarcode}
          onStatusChange={onStatusChange}
          product={product}
        />
      ))}
    </div>
  );
}

const MemoizedProductList = memo(ProductList);

export function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<InventoryTab>("All items");
  const [products, setProducts] = useState<InventoryProduct[]>(initialProducts);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>(() =>
    createInitialApprovals(initialProducts),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<EditingRow>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    packaged: false,
    promotions: false,
  });

  const meta = screenMeta[activeTab];

  const promotionsCount = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        rows: p.rows.filter((r) => r.actionLabel === "Added by you"),
      }))
      .filter((p: any) => p.rows.length > 0 && p.label === "Promotions").length;
  }, [products]);

  const visibleProducts = useMemo(() => {
    let baseProducts =
      activeTab === "Items sent for approval"
        ? createApprovalProducts(products, approvals)
        : activeTab === "Items added by you"
          ? products
              .map((product) => ({
                ...product,
                rows: product.rows.filter(
                  (row) => row.actionLabel === "Added by you",
                ),
              }))
              .filter((product) => product.rows.length > 0)
          : products;

    if (
      activeTab === "Items added by you" &&
      (filters.packaged || filters.promotions)
    ) {
      baseProducts = baseProducts.filter((product: any) => {
        if (filters.packaged && product.label === "Packaged Item") return true;
        if (filters.promotions && product.label === "Promotions") return true;
        return false;
      });
    }

    return baseProducts.filter((product) => {
      const search = searchTerm.trim().toLowerCase();
      const productFields = [
        product.name,
        product.subtitle,
        product.category,
        product.hsn,
        product.gst,
        product.label,
      ];
      const matchesSearch =
        !search ||
        productFields.some((field) => field?.toLowerCase().includes(search)) ||
        product.rows.some((row) => {
          const rowFields = [
            row.upc,
            row.batch,
            row.price,
            row.weight,
            row.offlinePrice,
            String(row.quantity),
            row.channel,
            row.actionLabel,
            row.status,
          ];
          return rowFields.some((field) =>
            field?.toLowerCase().includes(search),
          );
        });

      return matchesSearch;
    });
  }, [activeTab, approvals, products, searchTerm, filters]);

  const handleAddProduct = useCallback((draft: ProductDraft) => {
    const product = makeProductFromDraft(draft);

    setProducts((current) => [product, ...current]);
    if (product.label === "Packaged Item") {
      setApprovals((current) => [
        {
          id: `approval-${product.id}-${product.rows[0].id}`,
          productId: product.id,
          rowId: product.rows[0].id,
          status: "Approval pending",
        },
        ...current,
      ]);
    }
    setActiveTab("Items added by you");
    setIsAddOpen(false);
  }, []);

  const handleDeleteRow = useCallback((productId: string, rowId: string) => {
    setProducts((current) =>
      current
        .map((product) => {
          if (product.id !== productId) return product;
          if (rowId === "barcode-row")
            return { ...product, barcodeAction: false };

          return {
            ...product,
            rows: product.rows.filter((row) => row.id !== rowId),
          };
        })
        .filter((product) => product.rows.length > 0),
    );
    setApprovals((current) =>
      current.filter(
        (approval) =>
          !(approval.productId === productId && approval.rowId === rowId),
      ),
    );
  }, []);

  const handleEditRow = useCallback((productId: string, row: BatchRow) => {
    setEditingRow({ productId, row });
  }, []);

  const handleSaveRow = useCallback(
    (row: BatchRow) => {
      if (!editingRow) return;

      setProducts((current) =>
        current.map((product) =>
          product.id === editingRow.productId
            ? {
                ...product,
                rows: product.rows.map((item) =>
                  item.id === row.id ? row : item,
                ),
              }
            : product,
        ),
      );
      setEditingRow(null);
    },
    [editingRow],
  );

  const handleGenerateBarcode = useCallback((productId: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              rows: [
                ...product.rows,
                {
                  id: `${productId}-barcode-${Date.now()}`,
                  upc: String(
                    Math.floor(1000000000 + Math.random() * 9000000000),
                  ),
                  batch: "-",
                  offlinePrice: "₹200",
                  quantity: "800",
                  channel: "Offline",
                  actionLabel: "Added by you",
                },
              ],
            }
          : product,
      ),
    );
  }, []);

  const handleStatusChange = useCallback(
    (approvalId: string, status: ApprovalRecord["status"]) => {
      setApprovals((current) =>
        current.map((approval) =>
          approval.id === approvalId
            ? {
                ...approval,
                status,
                statusNote:
                  status === "Rejected" ? "Rejected due to XYZ." : undefined,
              }
            : approval,
        ),
      );
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-3 sm:px-6 py-6 sm:py-10 text-[#172033]">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* <div className="mb-8">
          <div className="h-[54px] w-full max-w-[1360px] bg-[#0c2ea8] px-8 text-3xl font-extrabold leading-[54px] text-white">
            {meta.title}
          </div>
          <p className="mt-6 text-3xl font-medium text-[#bdbdbd]">
            {meta.wireframe}
          </p>
        </div> */}

        <section className="mx-auto flex min-h-[1080px] max-w-[1360px] overflow-visible bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div
                className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-[260px] animate-in slide-in-from-left duration-300">
                <Sidebar />
              </div>
            </div>
          )}

          <div className="hidden lg:block">
            <Sidebar />
          </div>

          <main className="flex min-w-0 flex-1 flex-col bg-[#fbfcfe]">
            <div className="flex h-[54px] items-center border-b border-[#e9edf3] bg-white px-4 lg:hidden">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dbe2ea] hover:bg-slate-50 transition-colors"
              >
                <MenuIcon className="!h-5 !w-5" />
              </button>
              <p className="ml-3 text-sm font-bold">My inventory</p>
            </div>
            <div className="hidden lg:block">
              <TopBar onSearchChange={setSearchTerm} searchTerm={searchTerm} />
            </div>
            <InventoryToolbar
              activeTab={activeTab}
              onAddProduct={() => setIsAddOpen(true)}
              onSearchChange={setSearchTerm}
              onTabChange={setActiveTab}
              searchTerm={searchTerm}
              filters={filters}
              onToggleFilter={(type) =>
                setFilters((prev) => ({ ...prev, [type]: !prev[type] }))
              }
              promotionsCount={promotionsCount}
            />
            <MemoizedProductList
              mode={activeTab}
              onDeleteRow={handleDeleteRow}
              onEditRow={handleEditRow}
              onGenerateBarcode={handleGenerateBarcode}
              onStatusChange={handleStatusChange}
              products={visibleProducts}
            />
          </main>
        </section>
      </div>

      <ProductDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddProduct}
      />
      <RowDialog
        isOpen={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        onSave={handleSaveRow}
        row={editingRow?.row ?? null}
      />
    </div>
  );
}
