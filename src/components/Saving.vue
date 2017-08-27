<template>
  <div class="saving-loader" v-tippy="{arrow: true}" title="Saving Gist...">
    <div class="saving-item one"></div>
    <div class="saving-item two"></div>
    <div class="saving-item three"></div>
  </div>
</template>


<style lang="stylus" scoped>
$colorA = pink;
$colorB = brown;
$colorC = blue;

.saving-loader {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  perspective: 800px;
}

.saving-item {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.saving-item.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 3px solid $colorA;
}

.saving-item.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 3px solid $colorB;
}

.saving-item.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 3px solid $colorC;
}

@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>
