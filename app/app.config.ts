export default defineAppConfig({
  ui: {
    colors: {
      primary: 'amber',
      neutral: 'zinc'
    },
    slideover: {
      slots: {
        overlay: 'fixed inset-0 bg-zinc-900/80 dark:bg-zinc-950/90',
      }
    },
    modal: {
      slots: {
        overlay: 'fixed inset-0 bg-zinc-900/80 dark:bg-zinc-950/90',
      }
    }
  }
})
