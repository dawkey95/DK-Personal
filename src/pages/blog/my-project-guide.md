---
layout: ../../layout/MarkdownLayout.astro
title: "My Project Setup Guide"
pubDate: 2023-05-12
description: "A guide on how I set up my projects."
tags: ["nextjs", "tailwind", "blogging"]
---

# Project Setup Guide

## Introduction

This is guide about how I setup my projects using `Next.js`, `Tailwind CSS`, `RadixUI`, `Axios` and `DaisyUI`.
I will be using this guide as a reference for my future project setups so I am always setting up in the same way.

---

### Create the App

##### Next.js

```js
  npx create-next-app@latest
```

##### DaisyUI

```js
  npm i daisyui
```

##### Axios

```js
  npm i axios
```

---

### Config the Tailwind and Global CSS

For this I started using CSS variables to make it easier to change the colors of the app.
Here I create the `darkMode: 'class'` so I can use the class `dark` in the body tag to change the theme of the app. The `colors` are extended and created with a variable format so I can change the colors in the `:root` tag. The `fontFamily` is declared in the `layout.js` file and used on the body tag to change the font of the entire app.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: "var(--light-blue)",
        blueGray: "var(--blue-gray)",
        darkBlue: "var(--dark-blue)",
        eerieGray: "var(--eerie-gray)",
        lightGray: "var(--light-gray)",
        whiteGray: "var(--white-gray)",
        white: "var(--white)",
        black: "var(--black)",
        navyBlue: "var(--navy-blue)",
        hoverBtn: "var(--hover-btn)",
      },

      fontFamily: {
        mono: ["var(--font-space-mono)"],
      },

      boxShadow: {
        primaryShadow: "var(--primary-shadow)",
      },
    },
  },
  plugins: [require("daisyui")],
};
```

In the `global.css` file I declare the `:root` tag and the variables I will be using in the app. I also declare the `dark` class and the colors I will be using for the dark theme. These colors will change from porject to project.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* LIGHT MODE COLORS */
    --blue-gray: #697c9a;
    --dark-blue: #4b6a9b;
    --eerie-gray: #2b3442;
    --light-gray: #f6f8ff;
    --white-gray: #fefefe;

    /* SHARED COLORS */
    --light-blue: #0079ff;
    --hover-btn: #60abff;

    /* DARK MODE COLORS */
    --white: #ffffff;
    --black: #141d2f;
    --navy-blue: #1e2a47;

    /* BOX SHADOWS */
    --primary-shadow: 0px 16px 30px -10px rgba(70, 96, 187, 0.198567);
  }
}
```

---

### Config the Layout File

Here I import the font using `next/font/google` and the `./globals.css` file. if the fonts are variable there is no need to declare weights otherwise I decalre the weights required in an array. The `subsets` are the languages the font supports. The `variable` is the name of the variable that will be used in the `:root` tag.

```js
import "./globals.css";
import { Space_Mono } from "next/font/google";

const space_mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata = {
  title: "FEM | GitHub User API",
  description: "Created by Dawid Keyser",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`dark ${space_mono.variable}`}>{children}</body>
    </html>
  );
}
```

The way I use the font in the body `className` while also adding a `dark` class to the body tag is by using the `space_mono.variable` variable. This is the same as using `var(--font-space-mono)` in the `:root` tag.

---

### Custom Hooks for Dark Mode

Here are the two custom hooks I use to help create the dark mode switch in tailwind.

1. ##### useLocalStorage.jsx

```js
"use client";

import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
```

2. ##### useColorMode.jsx

```js
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage("color-mode", "dark");

  useEffect(() => {
    const classname = "dark";
    const bodyClasses = window.document.body.classList;

    colorMode === "dark"
      ? bodyClasses.add(classname)
      : bodyClasses.remove(classname);
  }, [colorMode]);

  return [colorMode, setColorMode];
}

export default useColorMode;
```

3.  ##### Dark Mode Switch
    I can then use the `useColorMode` hook to create a dark mode switch.

```js
import useColorMode from "@/hooks/useColorMode";
import { Button } from "react-aria-components";
import Image from "next/image";
```

```js
const [colorMode, setColorMode] = useColorMode();
```

In the Button component I use the `colorMode` state to change the text and fill colors of the button. I also use the `setColorMode` function to change the state of the `colorMode` state. This is done by checking if the `colorMode` state is equal to `light` and if it is then change it to `dark` otherwise change it to `light`.

```js
<Button
  className="flex flex-row font-bold tracking-[2.5px] text-[0.8125rem] text-darkBlue fill-darkBlue hover:fill-navyBlue  hover:text-navyBlue dark:text-white items-center gap-4 outline-none"
  onPress={() => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  }}
>
  {colorMode === "light" ? "DARK" : "LIGHT"}
  {colorMode === "light" ? (
    <svg width="20" height="20">
      <path
        d="M19.513 11.397a.701.701 0 00-.588.128 7.496 7.496 0 01-2.276 1.336 7.101 7.101 0 01-2.583.462 7.505 7.505 0 01-5.32-2.209 7.568 7.568 0 01-2.199-5.342c0-.873.154-1.72.41-2.49a6.904 6.904 0 011.227-2.21.657.657 0 00-.102-.924.701.701 0 00-.589-.128C5.32.61 3.427 1.92 2.072 3.666A10.158 10.158 0 000 9.83c0 2.8 1.125 5.342 2.967 7.19a10.025 10.025 0 007.16 2.98c2.353 0 4.527-.822 6.266-2.183a10.13 10.13 0 003.58-5.624.623.623 0 00-.46-.796z"
        fill="inherit"
        fill-rule="nonzero"
      />
    </svg>
  ) : (
    <Image src={"/assets/icon-sun.svg"} width={20} height={20} alt="" />
  )}
</Button>
```

---

This was a rough overview of how I implemented dark mode in my project and how I intially set up my projects in NextJS with Tailwind. I hope this helps you in your next project.
