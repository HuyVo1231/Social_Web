import SidebarContent from './SidebarContent'

export default function Sidebar() {
  return (
    <div className='fixed top-[80px] rounded-md left-0 w-[250px] h-[calc(100vh-64px)] bg-white border-r shadow-sm z-40 p-4 md:block hidden'>
      <SidebarContent />
    </div>
  )
}
