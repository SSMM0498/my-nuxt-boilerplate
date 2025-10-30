export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth();
  const user = useAuthUser();

  if (import.meta.client && !user.value) {
    await checkAuth();
  }
});
