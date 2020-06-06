<template>
  <div class="loading">
    <img src="../assets/Loading.svg" alt />
  </div>
</template>
 
<script>
export default {
  name: "LOADING",
  data() {
    return {};
  }
};
</script>
<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 121;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.loading img {
  width: 1rem;
  margin: 7rem auto;
  -webkit-animation: spin 2s linear 2s 5 alternate;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>