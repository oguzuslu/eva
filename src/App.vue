<template>
  <div>
    <navbar />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/header/Navbar";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data: () => ({
    //
  }),
};
</script>
