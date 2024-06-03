
const pfpList = [
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390914/blog_posts/pfp/lighthouse_t9mlla.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390915/blog_posts/pfp/sailboat-pfp_m5hyob.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390915/blog_posts/pfp/surreal-tree_r0cvve.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390914/blog_posts/pfp/mountain-minimalizm_jxpaeo.webp",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390913/blog_posts/pfp/humming-bird_e3wu4l.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390913/blog_posts/pfp/koi-fish_jekfbl.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390913/blog_posts/pfp/clown-fish_vfwrm2.jpg",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390912/blog_posts/pfp/shot-avogado6_f72iuu.webp",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390912/blog_posts/pfp/earth-avogado6_xthwhh.webp",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717390911/blog_posts/pfp/dog-avogado6_f6dwkr.webp",
"https://res.cloudinary.com/dx432kzlt/image/upload/v1717392964/blog_posts/pfp/angels-avogado6_wygqpn.jpg",
]

function getRandomPfp() {
   return pfpList[Math.floor(Math.random() * 10)]
}

module.exports = getRandomPfp;