import React, { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import Switch from "@mui/material/Switch";
import MaterialUISwitch from "@mui/material/Switch";
import { memo } from "react";

type TopBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const TopBar = memo(function TopBar({
  searchTerm,
  onSearchChange,
}: TopBarProps) {
  const [active, setActive] = useState(false);
  return (
    <header className="flex h-[62px] items-center border-b border-[#e9edf3] bg-white px-6">
      <h1 className="mr-8 text-[15px] font-semibold text-[#172033]">
        My inventory
      </h1>

      <label className="flex h-9 w-[260px] items-center rounded-lg border border-[#dfe5ed] bg-[#fafbfc] px-3">
        <SearchIcon className="mr-2 !h-4 !w-4 text-[#8996a8]" />
        <input
          aria-label="Search"
          className="w-full bg-transparent text-[11px] font-medium text-[#334155] outline-none placeholder:text-[#9aa6b5]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          value={searchTerm}
        />
      </label>

      <div className="ml-auto flex items-center gap-5">
        <label className="flex items-center gap-2 text-[14px] font-semibold text-[#1f2937]">
          {/* <MaterialUISwitch size="small" className="!m-0" /> */}
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            size="small"
            sx={{
              width: 42,
              height: 26,
              padding: 0,
              "& .MuiSwitch-switchBase": {
                padding: "3px",
              },
              "& .MuiSwitch-thumb": {
                width: 20,
                height: 20,
              },
              "& .MuiSwitch-track": {
                borderRadius: 13,
                backgroundColor: "#d1d5db",
                opacity: 1,
              },
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#fff",
                transform: "translateX(16px)",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#8b5cf6",
                opacity: 1,
              },
            }}
          />
          Store {active ? "active" : "inactive"}
        </label>
        <button className="grid h-8 w-8 place-items-center rounded-full text-[#334155] hover:bg-[#f6f8fb]">
          <NotificationsNoneIcon className="!h-4.5 !w-4.5" />
        </button>
        <div className="flex items-center gap-2">
          <img
            alt="Jesse Leos"
            className="h-8 w-8 rounded-full object-cover"
            height="32"
            src="/profile-pic.jpg"
            width="32"
          />
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-[#1f2937]">Jesse Leos</p>
            <p className="text-[10px] font-medium text-[#8996a8]">
              name@flowbite.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
});
