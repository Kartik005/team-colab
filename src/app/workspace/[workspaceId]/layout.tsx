"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup

} from "@/components/ui/resizable";

import Sidebar from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: WorkspaceIdLayoutProps) => {
  return (

    <div className="h-full">
      {/* <Toolbar /> */}
      {/* <div className="flex h-[calc(100vh-40px)]"> */}
        {/* -40px to compensate for toolbar height*/}
      <div className="flex h-[100vh]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="co-workspace-layout">

          <ResizablePanel
            defaultSize={20}
            minSize={20}
            className="bg-[#603561]"
          >
            <WorkspaceSidebar/>
          </ResizablePanel>

          <ResizableHandle withHandle/>
          <ResizablePanel
          minSize={20}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default layout