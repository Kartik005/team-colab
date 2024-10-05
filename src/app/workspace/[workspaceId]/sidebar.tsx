import UserButton from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
// import { SidebarButton } from "./sidebar-button"
// import { BellIcon, Home, MessageSquare, MoreHorizontal } from "lucide-react"


// sidebar doesn't get rerendered while developing, 
//so try to comment it out, then back to normal in the layout.tsx of this directory

const Sidebar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#257180] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      
      <WorkspaceSwitcher/>
      {/* <SidebarButton icon={Home} label="Home" isActive/>
      <SidebarButton icon={MessageSquare} label="Messages" isActive/>
      <SidebarButton icon={BellIcon} label="Notifications" isActive/>
      <SidebarButton icon={MoreHorizontal} label="More" isActive/> */}
      {/* <div className=" flex flex-col items-center justify-center gap-y-1 mt-auto"> */}
        <UserButton/>
      {/* </div> */}
    </aside>
  )
}

export default Sidebar