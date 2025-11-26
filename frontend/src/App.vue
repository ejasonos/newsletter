<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

let email = ref("");
let expand = ref(false);

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
        autoClose: 5000,
      });
      console.error("Server error");
    }
    toast(`A verification email has been sent to ${email.value}`, {
      autoClose: 5000,
    });
    email.value = "";
  } catch (err) {
    toast("Failed to get to server", {
      autoClose: 5000,
    });
    // console.error("Fetch from backend error: ") + err;
  }
};
</script>

<template>
  <main style="display:flex;justify-content:center; align-items:center;">
  <section
    style="
      width: 350px;
      margin: 10px 0;
      padding: 25px 10px;
      border-radius: 15px;
      box-shadow: 0 0 200px 50px pink;
      place-self: center;
      background-color: #fff;
    "
    v-if="expand === false"
  >
    <div style="display: flex; justify-content: center; position: relative">
      <div
        style="
          height: 70px;
          width: 70px;
          border-radius: 50%;
          clip-path: circle(50%);
        "
      >
        <img
          style="height: 100%; width: 100%"
          src="/IMG_20250805_192607_971.webp"
        />
      </div>
      <div
        style="
          width: 25px;
          height: 25px;
          position: absolute;
          right: 10px;
          border-radius: 100%;
          padding: 3px;
        "
        class="hover:bg-gray-100"
        v-on:click="expand === false ? (expand = true) : (expand = false)"
      >
        <img
          style="height: 100%; width: 100%; filter: invert(65%)"
          src="/plus.svg"
        />
      </div>
    </div>
    <div style="text-align: center; margin: 15px">
      <p
        class="transition-all duration-75 delay-75 hover:scale-105 ease-in"
        style="
          font-size: 1.2rem;
          font-weight: 700;
          color: #465;
          cursor: default;
        "
      >
        Discover new tech highlights from
        <span style="color: teal">Sleek AI</span>
      </p>
      <p
        class="transition-all duration-75 delay-75 hover:scale-105 ease-in"
        style="font-size: 1rem; color: gray; line-height: 24px; cursor: pointer"
      >
        Get latest tech updates from across the world of technology. Including
        AI, ML, EV, Quantum Mechanics, Space Tech..
      </p>
    </div>
    <div class="flex flex-no-wrap w-full justify-center items-center space-x-1">
      <button
        class="w-fit h-8 flex justify-center items-center text-center text-md text-white font-semibold bg-[rgb(80,80,220)] p-2 rounded-full border-2 border-[rgb(80,80,220)] border-transparent hover:bg-purple-800 focus:bg-blue-100 focus:text-purple-800 transition-all delay-70 ease-in uppercase"
        v-on:click="expand === false ? (expand = true) : (expand = false)"
      >
        subscribe to our newsletter
      </button>
      <div class="h-8 w-8 p-1 bg-[rgb(80,80,220)] rounded-full overflow-hidden hover:bg-purple-800"><img class="h-full w-full object-cover filter invert-90" src="/home-alt.svg" /></div>
    </div>
  </section>

  <section
    style="
      width: 350px;
      margin: 10px 0;
      padding: 25px 8px;
      border-radius: 15px;
      box-shadow: 0 0 200px 50px pink;
      place-self: center;
      background-color: #fff;
    "
    v-if="expand === true"
  >
    <div style="display: flex; justify-content: center; position: relative">
      <div
        style="
          height: 70px;
          width: 70px;
          border-radius: 50%;
          clip-path: circle(50%);
        "
      >
        <img
          style="height: 100%; width: 100%"
          src="/IMG_20250805_192607_971.webp"
        />
      </div>
      <div
        style="
          width: 25px;
          height: 25px;
          position: absolute;
          right: 10px;
          border-radius: 100%;
          padding: 3px;
        "
        class="hover:bg-gray-100"
        v-on:click="expand === false ? (expand = true) : (expand = false)"
      >
        <img
          style="height: 100%; width: 100%; filter: invert(65%)"
          src="/x.svg"
        />
      </div>
    </div>
    <div style="text-align: center; margin: 15px">
      <p
        class="transition-all duration-75 delay-75 hover:scale-105 ease-in"
        style="
          font-size: 1.2rem;
          font-weight: 700;
          color: #465;
          cursor: default;
        "
      >
        Discover new tech highlights from
        <span style="color: teal">Sleek AI</span>
      </p>
      <p
        class="transition-all duration-75 delay-75 hover:scale-105 ease-in"
        style="font-size: 1rem; color: gray; line-height: 24px; cursor: pointer"
      >
        Get latest tech updates from across the world of technology. Including
        AI, ML, EV, Quantum Mechanics, Space Tech..
      </p>
    </div>
    <form
      method="post"
      @submit.prevent="subscribe"
      style="
        margin: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
      "
    >
      <input
        placeholder="example@email.com"
        type="email"
        maxlength="150"
        name="email"
        v-model="email"
        required
        style="
          border: 2px solid rgba(0, 0, 0, 0.1);
          width: 100%;
          padding: 8px 15px;
          border-radius: 100px;
          color: darkblue;
          outline-color: blue;
        "
      />
      <button
        type="submit"
        class="w-full text-md text-white font-semibold bg-[rgb(80,80,220)] py-2 rounded-full border-2 border-[rgb(80,80,220)] border-transparent hover:bg-purple-900 focus:bg-blue-100 focus:text-purple-800 transition-all delay-70 ease-in uppercase"
      >
        Subscribe
      </button>
    </form>
    <div style="margin: 4px">
      <p
        style="
          font-size: 0.9rem;
          font-weight: 400;
          text-align: center;
          cursor: default;
        "
        class="text-zinc-400 hover:text-zinc-600"
      >
        By subscribing, I agree to Sleek AI's
        <u class="hover:text-[blue]">Terms of Use</u>, and acknowledge its
        <u class="hover:text-[blue]">Information Collection Notice</u> and
        <u class="hover:text-[blue]">Privacy Policy</u>
      </p>
    </div>
    <div style="margin: 25px 0 0 0">
      <div
        style="
          height: 0.1rem;
          width: 100%;
          background-color: rgba(20, 20, 20, 0.1);
        "
      ></div>
    </div>
    <footer style="margin: 20px 0 0 0">
      <p
        style="font-size: 0.9rem; text-align: center; color: rgba(0, 0, 0, 0.5)"
      >
        Already have an account?
        <a
          href="#"
          style="
            padding: 5px;
            border-radius: 5px;
            word-spacing: 0.05rem;
            font-weight: 500;
            cursor: default;
          "
          class="text-white bg-[blueviolet] hover:text-[blueviolet] hover:bg-zinc-400"
          >Visit our blog</a
        >
      </p>
    </footer>
  </section>
  </main>the 
</template>
