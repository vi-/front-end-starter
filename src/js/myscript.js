import objectFitImages from "object-fit-images";

import nav from "./modules/navigation.js";
import { getYear, getMediaQuery, debounce } from "./modules/helpers.js";

const burger = document.querySelector(".hamburger"),
  navEl = document.querySelector(".site-nav");

objectFitImages();

nav.init(burger, navEl);
console.log(getYear());
