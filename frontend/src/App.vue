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
        <div style="width: 20px; height: 20px; position: absolute; right: 10px">
          <img
            style="height: 100%; width: 100%; filter: invert(65%)"
            src="/x.svg"
          />
        </div>
      </div>
      <div style="text-align: center; margin: 15px">
        <p
          style="
            font-size: 1.2rem;
            font-weight: 700;
            color: darkblue;
            cursor: default;
          "
        >
          Discover more from
          <span style="color: teal">Sleek AI</span> Newsletter
        </p>
        <p style="font-size: 1.1rem; color: gray; line-height: 24px">
          Explain complex systems with simple terms, from the authors of the
          best selling system design book series....
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
          style="
            border: 2px solid rgba(0, 0, 0, 0.1);
            width: 100%;
            padding: 8px 10px;
            border-radius: 8px;
            color: darkblue;
            outline-color: blue;
          "
        />
        <button
          type="submit"
          class="w-full text-md text-white font-semibold bg-[rgb(80,80,220)] py-2 rounded-md border-2 border-[rgb(80,80,220)] hover:border-[rgb(80, 80, 220)] hover:bg-blue-100 hover:text-purple-800 transition-all delay-70 ease-in"
        >
          Subscribe
        </button>
      </form>
      <div style="margin: 4px">
        <p
          style="
            color: rgba(0, 0, 0, 0.4);
            font-size: 0.9rem;
            font-weight: 400;
            text-align: center;
            cursor: default;
          "
        >
          By subscribing, I agree to Substack's
          <u class="hover:text-[darkblue]">Terms of Use</u>, and acknowledge its
          <u class="hover:text-[darkblue]">Information Collection Notice</u> and
          <u class="hover:text-[darkblue]">Privacy Policy</u>
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
          style="
            font-size: 0.9rem;
            text-align: center;
            color: rgba(0, 0, 0, 0.5);
          "
        >
          Already have an account?
          <a
            href="#"
            style="font-weight: 500; color: blueviolet; cursor: default"
            class="hover:underline"
            >Sign in</a
          >
        </p>
      </footer>
    </section>
  <RouterView />
</template>
