<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

let email = ref("");

const subscribe = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
      }),
    });
    if (!res.ok) {
      toast("Error from Server", {
        autoClose: 5000
      });
      console.error("Server error");
    }
    toast(`A verification email has been sent to ${email.value}`, {
      autoClose: 5000,
    });
  } catch (err) {
    toast("Failed to get to server", {
      autoClose: 5000
    });
    // console.error("Fetch from backend error: ") + err;
  }
};
</script>

<template>
  <main
    class="flex justify-center items-center m-7 p-5 w-fit rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-blue-500"
  >
    <div
      class="m-2 h-full w-full p-3 flex flex-col space-y-2 rounded-lg bg-gradient-to-l from-transparent to-white"
    >
      <h1 class="block w-full font-bold text-xl text-purple-900">
        Subscribe to start knowing
      </h1>
      <form method="post" @submit.prevent="subscribe" class="grid space-y-2">
        <input
          class="border-4 border-purple-400 w-fit block rounded-lg pl-2"
          placeholder="example@email.com"
          type="email"
          maxlength="150"
          name="email"
          v-model="email"
        />
        <button
          type="submit"
          class="w-fit px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-900 text-xl text-white hover:text-gray-300 font-bold uppercase"
        >
          Subscribe
        </button>
      </form>
    </div>
  </main>
  <RouterView />
</template>

<style scoped></style>
