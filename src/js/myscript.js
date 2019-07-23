const objectFitImages = require("object-fit-images");

objectFitImages();

const nav 	= require("./modules/navigation.js");
const h 	= require("./modules/helpers.js");

const burger 	= document.querySelector('.hamburger'),
	  navEl 	= document.querySelector('.site-nav');

nav.init( burger, navEl );