export default defineNuxtRouteMiddleware(async () => {
  const { width } = useWindowSize();
  const { closeSidebar } = useUIData();

  if (width.value <= 768) {
    closeSidebar()
  }
});