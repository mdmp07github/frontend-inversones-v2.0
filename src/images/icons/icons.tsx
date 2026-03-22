import React from "react";
import { useTheme } from "@/components/theme-provider";

/* Icons Light - #292929 */
import HouseIconLight from "./icon-house-light.png";
import DashboardLightIcon from "./icon-dashboard-light.png";
import MoonLightIcon from "./icon-moon-light.png";
import SunLightIcon from "./icon-sun-light.png";
import MenuLightIcon from "./icon-menu-light.png";
import DoubleRightLightIcon from "./icon-double-right-light.png";
import DoubleLeftLightIcon from "./icon-double-left-light.png";
import MoreLightIcon from "./icon-more-light.png";
import SimpleRight1LightIcon from "./icon-simple-right-1-light.png";
import SimpleLeft1LightIcon from "./icon-simple-left-1-light.png";
import SimpleUp1LightIcon from "./icon-simple-up-1-light.png";
import SimpleDown1LightIcon from "./icon-simple-down-1-light.png";
import EditLightIcon from "./icon-edit-light.png";
import DeleteLightIcon from "./icon-delete-light.png";
import ImageLightIcon from "./icon-image-light.png";
import User1LightIcon from "./icon-user-1-light.png";
import Setting1LightIcon from "./icon-setting-1-light.png";
import LogoutLightIcon from "./icon-logout-light.png";
import Check1LightIcon from "./icon-check-1-light.png";
import MonitorLightIcon from "./icon-monitor-light.png";
import AddUserMaleLightIcon from "./icon-add-user-male-light.png";
import EyeOpenLightIcon from "./icon-eye-open-light.png";
import EyeCloseLightIcon from "./icon-eye-close-light.png";
import Document1LightIcon from "./icon-document-1-light.png";
import Info1LightIcon from "./icon-info-1-light.png";
import Point1LightIcon from "./icon-point-1-light.png";
import Clear1LightIcon from "./icon-clear-1-light.png";
import UploadFileLightIcon from "./icon-upload-file-light.png";
import Grid1LightIcon from "./icon-grid-1-light.png";
import Column1LightIcon from "./icon-column-1-light.png";
import Plus1LightIcon from "./icon-plus-1-light.png";
import DownloadLightIcon from "./icon-download-light.png";
import QrCode1LightIcon from "./icon-qr-code-1-light.png";
import Send1LightIcon from "./icon-send-1-light.png";
import pdfLightIcon from "./icon-pdf-light.png";
import wordLightIcon from "./icon-word-light.png";
import excelLightIcon from "./icon-excel-light.png";
import tradingLightIcon from "./icon-trading-light.png";
import saveLightIcon from "./icon-save-light.png";
import cancel1LightIcon from "./icon-cancel-1-light.png";
import refreshLightIcon from "./icon-refresh-light.png";
import filter1LightIcon from "./icon-filter-1-light.png";

/* Icons Dark - #F9F9F9 */
import HouseBlackIcon from "./icon-house-black.png";
import DashboardBlackIcon from "./icon-dashboard-black.png";
import MoonBlackIcon from "./icon-moon-black.png";
import SunBlackIcon from "./icon-sun-black.png";
import MenuBlackIcon from "./icon-menu-black.png";
import DoubleRightBlackIcon from "./icon-double-right-black.png";
import DoubleLeftBlackIcon from "./icon-double-left-black.png";
import MoreBlackIcon from "./icon-more-black.png";
import SimpleRight1BlackIcon from "./icon-simple-right-1-black.png";
import SimpleLeft1BlackIcon from "./icon-simple-left-1-black.png";
import SimpleUp1BlackIcon from "./icon-simple-up-1-black.png";
import SimpleDown1BlackIcon from "./icon-simple-down-1-black.png";
import EditBlackIcon from "./icon-edit-black.png";
import DeleteBlackIcon from "./icon-delete-black.png";
import ImageBlackIcon from "./icon-image-black.png";
import User1BlackIcon from "./icon-user-1-black.png";
import Setting1BlackIcon from "./icon-setting-1-black.png";
import LogoutBlackIcon from "./icon-logout-black.png";
import Check1BlackIcon from "./icon-check-1-black.png";
import MonitorBlackIcon from "./icon-monitor-black.png";
import AddUserMaleBlackIcon from "./icon-add-user-male-black.png";
import EyeOpenBlackIcon from "./icon-eye-open-black.png";
import EyeCloseBlackIcon from "./icon-eye-close-black.png";
import Document1BlackIcon from "./icon-document-1-black.png";
import Info1BlackIcon from "./icon-info-1-black.png";
import Point1BlackIcon from "./icon-point-1-black.png";
import Clear1BlackIcon from "./icon-clear-1-black.png";
import UploadFileBlackIcon from "./icon-upload-file-black.png";
import Grid1BlackIcon from "./icon-grid-1-black.png";
import Column1BlackIcon from "./icon-column-1-black.png";
import Plus1BlackIcon from "./icon-plus-1-black.png";
import DownloadBlackIcon from "./icon-download-black.png";
import QrCode1BlackIcon from "./icon-qr-code-1-black.png";
import Send1BlackIcon from "./icon-send-1-black.png";
import pdfBlackIcon from "./icon-pdf-black.png";
import wordBlackIcon from "./icon-word-black.png";
import excelBlackIcon from "./icon-excel-black.png";
import tradingBlackIcon from "./icon-trading-black.png";
import saveBlackIcon from "./icon-save-black.png";
import cancel1BlackIcon from "./icon-cancel-1-black.png";
import refreshBlackIcon from "./icon-refresh-black.png";
import filter1BlackIcon from "./icon-filter-1-black.png";

interface IconProps {
  icon: string;
  className?: string;
  onClick?: () => void;
}

const Icons = React.forwardRef<HTMLDivElement, IconProps>(({ icon, className, onClick, ...props }, ref) => {
  const { theme } = useTheme();

  const effectiveTheme =
    theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
      : theme;

  const getIconSrc = () => {
    switch (icon) {
      case "house":
        return effectiveTheme === "dark" ? HouseIconLight : HouseBlackIcon;
      case "dashboard":
        return effectiveTheme === "dark" ? DashboardLightIcon : DashboardBlackIcon;
      case "moon":
        return effectiveTheme === "dark" ? MoonLightIcon : MoonBlackIcon;
      case "sun":
        return effectiveTheme === "dark" ? SunLightIcon : SunBlackIcon;
      case "menu":
        return effectiveTheme === "dark" ? MenuLightIcon : MenuBlackIcon;
      case "double-right":
        return effectiveTheme === "dark" ? DoubleRightLightIcon : DoubleRightBlackIcon;
      case "double-left":
        return effectiveTheme === "dark" ? DoubleLeftLightIcon : DoubleLeftBlackIcon;
      case "more":
        return effectiveTheme === "dark" ? MoreLightIcon : MoreBlackIcon;
      case "simple-right-1":
        return effectiveTheme === "dark" ? SimpleRight1LightIcon : SimpleRight1BlackIcon;
      case "simple-left-1":
        return effectiveTheme === "dark" ? SimpleLeft1LightIcon : SimpleLeft1BlackIcon;
      case "simple-up-1":
        return effectiveTheme === "dark" ? SimpleUp1LightIcon : SimpleUp1BlackIcon;
      case "simple-down-1":
        return effectiveTheme === "dark" ? SimpleDown1LightIcon : SimpleDown1BlackIcon;
      case "edit":
        return effectiveTheme === "dark" ? EditLightIcon : EditBlackIcon;
      case "delete":
        return effectiveTheme === "dark" ? DeleteLightIcon : DeleteBlackIcon;
      case "image":
        return effectiveTheme === "dark" ? ImageLightIcon : ImageBlackIcon;
      case "user1":
        return effectiveTheme === "dark" ? User1LightIcon : User1BlackIcon;
      case "setting1":
        return effectiveTheme === "dark" ? Setting1LightIcon : Setting1BlackIcon;
      case "logout":
        return effectiveTheme === "dark" ? LogoutLightIcon : LogoutBlackIcon;
      case "check1":
        return effectiveTheme === "dark" ? Check1LightIcon : Check1BlackIcon;
      case "monitor":
        return effectiveTheme === "dark" ? MonitorLightIcon : MonitorBlackIcon;
      case "add-user-male":
        return effectiveTheme === "dark" ? AddUserMaleLightIcon : AddUserMaleBlackIcon;
      case "eye-open":
        return effectiveTheme === "dark" ? EyeOpenLightIcon : EyeOpenBlackIcon;
      case "eye-close":
        return effectiveTheme === "dark" ? EyeCloseLightIcon : EyeCloseBlackIcon;
      case "document1":
        return effectiveTheme === "dark" ? Document1LightIcon : Document1BlackIcon;
      case "info1":
        return effectiveTheme === "dark" ? Info1LightIcon : Info1BlackIcon;
      case "point1":
        return effectiveTheme === "dark" ? Point1LightIcon : Point1BlackIcon;
      case "clear1":
        return effectiveTheme === "dark" ? Clear1LightIcon : Clear1BlackIcon;
      case "upload-file":
        return effectiveTheme === "dark" ? UploadFileLightIcon : UploadFileBlackIcon;
      case "grid1":
        return effectiveTheme === "dark" ? Grid1LightIcon : Grid1BlackIcon;
      case "column1":
        return effectiveTheme === "dark" ? Column1LightIcon : Column1BlackIcon;
      case "plus1":
        return effectiveTheme === "dark" ? Plus1LightIcon : Plus1BlackIcon;
      case "download":
        return effectiveTheme === "dark" ? DownloadLightIcon : DownloadBlackIcon;
      case "qr-code-1":
        return effectiveTheme === "dark" ? QrCode1LightIcon : QrCode1BlackIcon;
      case "send-1":
        return effectiveTheme === "dark" ? Send1LightIcon : Send1BlackIcon;
      case "pdf":
        return effectiveTheme === "dark" ? pdfLightIcon : pdfBlackIcon;
      case "word":
        return effectiveTheme === "dark" ? wordLightIcon : wordBlackIcon;
      case "excel":
        return effectiveTheme === "dark" ? excelLightIcon : excelBlackIcon;
      case "trading":
        return effectiveTheme === "dark" ? tradingLightIcon : tradingBlackIcon;
      case "save":
        return effectiveTheme === "dark" ? saveLightIcon : saveBlackIcon;
      case "cancel1":
        return effectiveTheme === "dark" ? cancel1LightIcon : cancel1BlackIcon;
      case "refresh":
        return effectiveTheme === "dark" ? refreshLightIcon : refreshBlackIcon;
      case "filter1":
        return effectiveTheme === "dark" ? filter1LightIcon : filter1BlackIcon;
      default:
        return null;
    }
  };

  const iconSrc = getIconSrc();
  if (!iconSrc) return null;

  return (
    <div ref={ref} className={className} onClick={onClick}>
      <img src={iconSrc} alt={icon} className={"w-6 h-6"} {...props} />
    </div>
  )
});

export default Icons;