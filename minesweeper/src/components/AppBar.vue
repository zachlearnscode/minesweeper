<template>
  <v-app-bar flat class="light-green lighten-1">
    <v-container fluid class="font-weight-bold white--text">
      <v-row>
        <v-col
          cols="8"
          sm="6"
          align-self="center"
          class="d-flex align-center justify-start px-0"
        >
          <v-btn-toggle group mandatory v-model="difficulty" @change="$emit('difficulty-changed', difficulty)">
            <v-btn value="easy"> {{ isMobile ? "E" : "Easy" }} </v-btn>
            <v-btn value="medium" selected>
              {{ isMobile ? "M" : "Medium" }}
            </v-btn>
            <v-btn value="hard"> {{ isMobile ? "H" : "Hard" }} </v-btn>
          </v-btn-toggle>
          <v-btn icon class="ml-sm-2" @click="$emit('new-game')">
            <v-icon color="white">mdi-refresh</v-icon>
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="4"
          sm="6"
          align-self="center"
          class="d-flex flex-column flex-sm-row justify-end align-end"
        >
          <span class="mr-sm-2 text-right text-sm-h5"
            >🚩 {{ flagsAvailable }}</span
          >
          <span class="text-sm-h5">⏲️ {{ timeElapsed | padTime }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  props: ["isMobile", "flagsAvailable", "timeElapsed"],
  data() {
    return {
      difficulty: "medium"
    }
  },
  filters: {
    padTime(num) {
      let time = String(num);
      while (time.length < 3) {
        time = "0" + time;
      }
      return time;
    },
  }
};
</script>

<style>
</style>