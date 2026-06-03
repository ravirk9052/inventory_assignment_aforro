import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { memo } from "react";

export const ShellLogo = memo(function ShellLogo() {
  return (
    <div className="flex h-8 items-center gap-1.5">
      {/* <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1555ff] text-white shadow-[0_0_0_2px_rgba(21,85,255,0.08)]"> */}
      <img
        alt="Jesse Leos"
        className="h-7 w-7 rounded-full"
        src="/sheld-logo.png"
      />
      {/* </span> */}
      <span className="text-[13px] font-bold text-[#1e2a3b]">Shelf OS</span>
    </div>
  );
});
