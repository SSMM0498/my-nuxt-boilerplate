export default defineEventHandler(async (event) => {
  const pb = await createPocketBaseInstance(event);
  const config = useRuntimeConfig();

  if (event.context.authFailed) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  if (!pb.authStore.isValid || !pb.authStore.record) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = pb.authStore.record?.id;

  try {
    await pb.collection('users').delete(userId!);

    pb.authStore.clear();
    deleteCookie(event, config.COOKIE_NAME);
    return { success: true, message: 'Account deleted successfully.' };
  } catch (error) {
    console.error('Account deletion error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete account.' });
  }
});