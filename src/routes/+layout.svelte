<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class=app-shell>
  <Header />
  <main class=main-content>
    <slot />
  </main>
  <Footer />
</div>

<style>
  .app-shell {
    display: flex; flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
  }
  .main-content {
    flex: 1;
    padding: 32px 0;
  }
  @media (max-width: 640px) {
    .main-content { padding: 20px 0; }
  }
</style>
