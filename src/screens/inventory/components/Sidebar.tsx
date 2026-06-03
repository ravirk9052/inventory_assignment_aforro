import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { memo } from "react";
import { navItems, utilityNavItems } from "../inventoryData";
import type { NavItem } from "../types";
import { ShellLogo } from "./ShellLogo";

const NavSection = memo(function NavSection({ item }: { item: NavItem }) {
  return (
    <div>
      <button
        className={`flex h-8 w-full items-center rounded-md px-2 text-left text-[11px] font-medium transition ${
          item.active
            ? "bg-[#f2f6ff] text-[#1555ff]"
            : "text-[#334155] hover:bg-[#f7f9fc]"
        }`}
      >
        {typeof item.icon === "string" ? (
          <img
            src={item.icon}
            alt={item.label}
            className="mr-2 h-5 w-5 object-contain"
          />
        ) : (
          (() => {
            const Icon = item.icon;
            return <Icon className="mr-2 !h-5 !w-5" />;
          })()
        )}

        <span className="min-w-0 flex-1 truncate">{item.label}</span>

        {item.badge && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#fff0f3] px-1.5 text-[10px] font-bold text-[#df2758]">
            {item.badge}
          </span>
        )}

        {item.children && (
          <ExpandLessIcon className="!h-4 !w-4 text-[#1555ff]" />
        )}
      </button>

      {item.children && (
        <div className="ml-7 mt-1 space-y-1">
          {item.children.map((child, index) => (
            <button
              key={child}
              className={`block h-7 w-full rounded-md px-2 text-left text-[11px] font-medium ${
                index === 0 && item.label === "Inventory"
                  ? "text-[#334155]"
                  : "text-[#475569]"
              } hover:bg-[#f7f9fc]`}
            >
              {child}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export const Sidebar = memo(function Sidebar() {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[#e8edf4] bg-white px-4 py-5">
      <ShellLogo />
      <hr className="mt-3" />
      <nav className="mt-7 space-y-1.5">
        {navItems.map((item) => (
          <NavSection key={item.label} item={item} />
        ))}
      </nav>

      <nav className="mt-auto border-t border-[#edf1f5] pt-4">
        {utilityNavItems.map((item) => (
          <button
            key={item.label}
            className="flex h-8 w-full items-center rounded-md px-2 text-left text-[11px] font-medium text-[#334155] hover:bg-[#f7f9fc]"
          >
            {typeof item.icon === "string" ? (
              <img
                src={item.icon}
                alt={item.label}
                className="mr-2 h-5 w-5 object-contain"
              />
            ) : (
              (() => {
                const Icon = item.icon;
                return <Icon className="mr-2 !h-5 !w-5" />;
              })()
            )}

            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
});
