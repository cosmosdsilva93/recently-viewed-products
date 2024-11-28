import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
// Add Firebase products that you want to use
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4wxdoKC4fGq7o0FiT_6VQYILKF9wC4wE",
    authDomain: "recently-viewed-products-a170b.firebaseapp.com",
    projectId: "recently-viewed-products-a170b",
    storageBucket: "recently-viewed-products-a170b.firebasestorage.app",
    messagingSenderId: "693365995051",
    appId: "1:693365995051:web:8fa3e2622a5e12b630dc6e",
    measurementId: "G-8LPZT6520H"
};

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const allProductsList = document.getElementById("all-products-list");
const allProductsAlert = document.getElementById("all-products-alert");
const recentProductsAlert = document.getElementById("recent-products-alert");
const recentProductsList = document.getElementById("recent-products-list");
const nameElem = document.getElementById('user-name');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let userData;

// Google Sign-In
const provider = new GoogleAuthProvider();

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User signed in:", result.user);
    })
    .catch((error) => console.error("Sign-in error:", error));
});

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => console.log("User signed out"))
    .catch((error) => console.error("Sign-out error:", error));
});

document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("product-link")) {
    await logProductView(event.target.dataset.url);
  }
});

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    userData = user;
    console.log("User is signed in:", userData);
    updateUI(userData);
  } else {
    console.log("No user is signed in");
    updateUI(null);
  }
});

// Fetch Recently Viewed Products (Backend API Call)
const fetchRecentlyViewed = async (userId, token) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/recentlyViewed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass Firebase Auth token for verification
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();  
      return data
    } catch (error) {
      console.error(error);
      return [];
    }
};

const fetchAllProducts = async (token) => {
    try {
      const response = await fetch(`/api/v1/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass Firebase Auth token for verification
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
};

const logProductView = async (path) => {
  try {
    const linkSplit = path.split('/');
    console.log(linkSplit);
    const response = await fetch(`/api/v1/users/${userData.uid}/recentlyViewed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.accessToken}`, // Pass Firebase Auth token for verification
      },
      body: JSON.stringify({
        productId: linkSplit[2]
      })
    });
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    } 
    window.location.href = path;
  } catch (error) {
    console.error(error);
    return [];
  }
};
  
// Update UI
const updateUI = async (user) => {
  if (user) {
    nameElem.innerText = user.displayName;
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";

    // Fetch and display all products
    const products = await fetchAllProducts(user.accessToken);
    if (products.length) {
      allProductsAlert.style.display = "none";
      allProductsList.style.display = "block";
      allProductsList.innerHTML = products
        .map(
          (product) =>
            `<li class="list-group-item"><a href="#" data-url="/products/${product.id}" class="product-link">${product.name}</a></li>`
        )
        .join("");
    } else {
      allProductsAlert.style.display = "block";
    }

    //Fetch and display recent products
    const recentProducts = await fetchRecentlyViewed(user.uid, user.accessToken);
    console.log(recentProducts);
    if (recentProducts.length) {
      recentProductsAlert.style.display = "none";
      recentProductsList.style.display = "block";
      recentProductsList.innerHTML = recentProducts
        .map(
          (product) =>
          `<li class="list-group-item"><span class="badge">${product.viewCount}</span><a href="#" data-url="/products/${product.id}" class="product-link">${product.name}</a></li>`
        )
        .join("");
    } else {
      recentProductsAlert.style.display = "block";
    }
  } else {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
  }
};

