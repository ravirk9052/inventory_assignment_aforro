import AddIcon from "@mui/icons-material/Add";
import {
  AccountCircleOutlined,
  CheckBox,
  CheckBoxOutlineBlank,
  FilterAltOutlined,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { memo } from "react";
import type { InventoryTab } from "../types";

const tabs = [
  { label: "All items" },
  { label: "Items added by you" },
  {
    label: "Items sent for approval",
    icon: AccountCircleOutlined,
  },
] satisfies Array<{ label: InventoryTab; icon?: typeof AccountCircleOutlined }>;

type InventoryToolbarProps = {
  activeTab: InventoryTab;
  searchTerm: string;
  onAddProduct: () => void;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: InventoryTab) => void;
  filters: { packaged: boolean; promotions: boolean };
  onToggleFilter: (type: "packaged" | "promotions") => void;
  promotionsCount: number;
};

export const InventoryToolbar = memo(function InventoryToolbar({
  activeTab,
  searchTerm,
  onAddProduct,
  onSearchChange,
  onTabChange,
  filters,
  onToggleFilter,
  promotionsCount,
}: InventoryToolbarProps) {
  return (
    <div className="border-b border-[#e9edf3] bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:h-[72px] lg:items-center px-5 py-4 lg:py-0 gap-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;

            return (
              <button
                key={tab.label}
                onClick={() => onTabChange(tab.label)}
                className={`flex h-9 items-center gap-2 rounded-full px-4 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#1555ff] text-white"
                    : "text-[#415066] hover:bg-[#f5f7fa]"
                }`}
              >
                {Icon && <Icon className="!h-4 !w-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 lg:ml-auto">
          <p className="text-[11px] font-medium text-[#738095] hidden sm:block">
            Can't find product in list?
          </p>
          <button
            onClick={onAddProduct}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#dbe2ea] bg-white px-4 text-[11px] font-bold text-[#334155] ml-auto lg:ml-0 whitespace-nowrap"
          >
            <AddIcon className="!h-4 !w-4" />
            Add new product
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:min-h-[58px] md:items-center px-5 py-3 md:py-0 gap-4">
        <label className="flex h-9 w-full md:w-[260px] items-center rounded-lg border border-[#dfe5ed] bg-white px-3">
          <SearchIcon className="mr-2 !h-4 !w-4 text-[#8996a8]" />
          <input
            aria-label="Search for Product"
            className="w-full bg-transparent text-[11px] font-medium outline-none placeholder:text-[#9aa6b5]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for Product"
            value={searchTerm}
          />
        </label>

        {activeTab === "Items added by you" ? (
          <div className="flex items-center gap-4 text-[11px] font-medium text-[#334155] flex-wrap">
            <button
              onClick={() => onToggleFilter("packaged")}
              className="flex items-center gap-1"
            >
              {filters.packaged ? (
                <CheckBox className="!h-4 !w-4 text-[#1555ff]" />
              ) : (
                <CheckBoxOutlineBlank className="!h-4 !w-4 text-[#8996a8]" />
              )}
              Packaged product
            </button>
            <button
              onClick={() => onToggleFilter("promotions")}
              className="flex items-center gap-1"
            >
              {filters.promotions ? (
                <CheckBox className="!h-4 !w-4 text-[#1555ff]" />
              ) : (
                <CheckBoxOutlineBlank className="!h-4 !w-4 text-[#8996a8]" />
              )}
              Promotions{" "}
              <span className="text-[#738095]">{promotionsCount}</span>
            </button>
          </div>
        ) : null}

        <button className="md:ml-auto flex h-9 items-center gap-2 rounded-lg border border-[#dbe2ea] bg-white px-4 text-[11px] font-semibold text-[#334155] w-fit">
          <FilterAltOutlined className="!h-4 !w-4 text-[#66758a]" />
          Filters
        </button>
      </div>

      {activeTab === "Items added by you" ? (
        <div className="flex h-10 items-center gap-8 border-t border-[#eef2f6] px-5 text-[11px] font-semibold">
          <button className="h-full border-b-2 border-[#1555ff] text-[#1555ff]">
            Items present in the inventory
          </button>
          <button className="text-[#526274]">Drafts</button>
        </div>
      ) : null}
    </div>
  );
});
