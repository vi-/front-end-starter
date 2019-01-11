require("babel-polyfill");

const objectFitImages = require("object-fit-images");

objectFitImages();

const nav = require("./modules/navigation.js");

const burger 	= document.querySelector('.hamburger'),
			navEl 	= document.querySelector('.site-nav')

nav.init( burger, navEl );