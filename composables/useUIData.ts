export const useUIData = () => {
  const { width } = useWindowSize()

  const toggleSidebar = useState(() => true);

  watch(() => width.value, () => {
    if (width.value <= 768) {
      toggleSidebar.value = false
    } else {
      toggleSidebar.value = true
    }
  })

  const openSidebar = () => {
    toggleSidebar.value = true
    console.log("Open Sidebar", toggleSidebar.value);
  }

  const closeSidebar = () => {
    toggleSidebar.value = false
    console.log("Close Sidebar", toggleSidebar.value);
  }

  return { toggleSidebar, openSidebar, closeSidebar }
}